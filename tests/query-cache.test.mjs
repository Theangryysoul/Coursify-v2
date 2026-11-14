import assert from "node:assert/strict";
import test from "node:test";
import { setTimeout as delay } from "node:timers/promises";
import { QueryObserver } from "@tanstack/react-query";

import {
  createQueryClient,
  DATA_CACHE_POLICIES,
  getQueryUserId,
  invalidateResume,
  invalidateUserData,
  queryKeys,
  removeOtherUserQueries,
} from "../src/lib/query-cache.ts";

function clientFor(t) {
  const client = createQueryClient();
  t.after(() => client.clear());
  return client;
}

function seedPrivateData(client, userId) {
  const keys = [
    queryKeys.courses(userId),
    queryKeys.folders(userId),
    queryKeys.learningStats(userId),
    queryKeys.heatmap(userId),
    queryKeys.courseDetails("course-1", userId),
    queryKeys.resume("video-1", userId),
    queryKeys.currentUser(userId),
  ];
  for (const key of keys) client.setQueryData(key, { owner: userId });
  return keys;
}

function observe(client, options) {
  const observer = new QueryObserver(client, options);
  const unsubscribe = observer.subscribe(() => {});
  return () => {
    unsubscribe();
    observer.destroy();
  };
}

test("only selected datasets receive longer retention and stale-only revalidation", (t) => {
  const client = clientFor(t);
  const expected = {
    courses: 60_000,
    folders: 300_000,
    "learning-stats": 30_000,
    heatmap: 60_000,
  };

  for (const [root, staleTime] of Object.entries(expected)) {
    const options = client.defaultQueryOptions({ queryKey: [root, "account-a"] });
    assert.equal(options.staleTime, staleTime);
    assert.equal(options.gcTime, 1_800_000);
    assert.equal(options.refetchOnMount, true);
    assert.equal(options.refetchOnWindowFocus, true);
    assert.equal(options.refetchOnReconnect, true);
  }

  // The player's existing query-specific staleTime=0 and other defaults survive.
  const details = client.defaultQueryOptions({
    queryKey: queryKeys.courseDetails("course-1", "account-a"),
    staleTime: 0,
  });
  assert.equal(details.staleTime, 0);
  assert.equal(details.gcTime, undefined);
  assert.equal(details.refetchOnWindowFocus, false);

  const resume = client.defaultQueryOptions({ queryKey: queryKeys.resume("video-1", "account-a") });
  assert.equal(resume.staleTime, 300_000);
  assert.equal(resume.gcTime, undefined);
  assert.equal(resume.refetchOnWindowFocus, false);
  assert.deepEqual(Object.keys(DATA_CACHE_POLICIES), Object.keys(expected));
});

test("fresh course data is reused without another request", async (t) => {
  const client = clientFor(t);
  let requests = 0;
  const options = {
    queryKey: queryKeys.courses("account-a"),
    queryFn: async () => [{ title: `Course ${++requests}` }],
  };

  const first = await client.fetchQuery(options);
  const second = await client.fetchQuery(options);
  assert.equal(requests, 1);
  assert.strictEqual(second, first);
});

test("old entries remain readable while a background refresh runs", async (t) => {
  const client = clientFor(t);
  const key = queryKeys.courses("account-a");
  const oldData = [{ title: "Existing course" }];
  client.setQueryData(key, oldData, { updatedAt: Date.now() - 61_000 });
  let finish;
  const pending = client.fetchQuery({
    queryKey: key,
    queryFn: () => new Promise((resolve) => { finish = resolve; }),
  });

  assert.deepEqual(client.getQueryData(key), oldData);
  assert.equal(client.getQueryState(key).fetchStatus, "fetching");
  finish([{ title: "Updated course" }]);
  await pending;
  assert.deepEqual(client.getQueryData(key), [{ title: "Updated course" }]);
});

test("a stale course remount keeps cached data and refreshes once", async (t) => {
  const client = clientFor(t);
  const key = queryKeys.courses("account-a");
  client.setQueryData(key, ["old"], { updatedAt: Date.now() - 61_000 });
  let requests = 0;
  const stop = observe(client, {
    queryKey: key,
    queryFn: async () => { requests++; return ["new"]; },
  });
  try {
    assert.deepEqual(client.getQueryData(key), ["old"]);
    await delay(0);
    assert.equal(requests, 1);
    assert.deepEqual(client.getQueryData(key), ["new"]);
  } finally {
    stop();
  }
});

test("fresh observers do not refetch on remount or focus", async (t) => {
  const client = clientFor(t);
  const key = queryKeys.folders("account-a");
  client.setQueryData(key, ["folder"]);
  let requests = 0;
  const options = { queryKey: key, queryFn: async () => { requests++; return ["folder"]; } };
  const stop = observe(client, options);
  try {
    client.getQueryCache().onFocus();
    await delay(0);
    assert.equal(requests, 0);
  } finally {
    stop();
  }
  const stopAgain = observe(client, options);
  try {
    await delay(0);
    assert.equal(requests, 0);
  } finally {
    stopAgain();
  }
});

test("stale statistics refresh on focus and reconnect without polling", async (t) => {
  const client = clientFor(t);
  const key = queryKeys.learningStats("account-a");
  client.setQueryData(key, { totalCourses: 1 });
  let requests = 0;
  const stop = observe(client, {
    queryKey: key,
    queryFn: async () => ({ totalCourses: ++requests + 1 }),
  });
  try {
    client.setQueryData(key, { totalCourses: 1 }, { updatedAt: Date.now() - 31_000 });
    client.getQueryCache().onFocus();
    await delay(0);
    assert.equal(requests, 1);
    client.setQueryData(key, { totalCourses: 2 }, { updatedAt: Date.now() - 31_000 });
    client.getQueryCache().onOnline();
    await delay(0);
    assert.equal(requests, 2);
  } finally {
    stop();
  }
});

test("successful changes invalidate fresh data for the originating account only", async (t) => {
  const client = clientFor(t);
  seedPrivateData(client, "account-a");
  seedPrivateData(client, "account-b");

  // Same dependency set used after an import.
  await invalidateUserData(client, "account-a", ["courses", "folders", "learning-stats"]);
  for (const root of ["courses", "folders", "learning-stats"]) {
    assert.equal(client.getQueryState([root, "account-a"]).isInvalidated, true);
    assert.equal(client.getQueryState([root, "account-b"]).isInvalidated, false);
  }
  assert.equal(client.getQueryState(queryKeys.heatmap("account-a")).isInvalidated, false);

  let requests = 0;
  await client.fetchQuery({
    queryKey: queryKeys.courses("account-a"),
    queryFn: async () => { requests++; return []; },
  });
  assert.equal(requests, 1);
});

test("active data refreshes immediately after invalidation", async (t) => {
  const client = clientFor(t);
  const key = queryKeys.courses("account-a");
  client.setQueryData(key, ["old"]);
  let requests = 0;
  const stop = observe(client, {
    queryKey: key,
    queryFn: async () => { requests++; return ["new"]; },
  });
  try {
    await invalidateUserData(client, "account-a", ["courses"]);
    assert.equal(requests, 1);
    assert.deepEqual(client.getQueryData(key), ["new"]);
  } finally {
    stop();
  }
});

test("private query keys cannot reuse another account's data", (t) => {
  const client = clientFor(t);
  seedPrivateData(client, "account-a");
  for (const key of [
    queryKeys.courses("account-b"),
    queryKeys.folders("account-b"),
    queryKeys.learningStats("account-b"),
    queryKeys.heatmap("account-b"),
    queryKeys.courseDetails("course-1", "account-b"),
    queryKeys.resume("video-1", "account-b"),
    queryKeys.currentUser("account-b"),
    queryKeys.courses(null),
  ]) assert.equal(client.getQueryData(key), undefined);
});

test("private queries require an authenticated identity, not cached content", () => {
  assert.equal(getQueryUserId({ status: "loading", user: { _id: "a" } }), null);
  assert.equal(getQueryUserId({ status: "unauthenticated", user: { _id: "a" } }), null);
  assert.equal(getQueryUserId({ status: "authenticated", user: null }), null);
  assert.equal(getQueryUserId({ status: "authenticated", user: { _id: "a" } }), "a");
});

test("account switches remove outgoing data, retaining incoming data and public config", (t) => {
  const client = clientFor(t);
  const oldKeys = seedPrivateData(client, "account-a");
  const newKeys = seedPrivateData(client, "account-b");
  client.setQueryData(["auth", "config"], { googleClientId: "public-client-id" });
  const mutation = client.getMutationCache().build(client, { mutationFn: async () => {} });

  removeOtherUserQueries(client, "account-b");
  for (const key of oldKeys) assert.equal(client.getQueryData(key), undefined);
  for (const key of newKeys) assert.deepEqual(client.getQueryData(key), { owner: "account-b" });
  assert.ok(client.getQueryData(["auth", "config"]));
  assert.ok(client.getMutationCache().getAll().includes(mutation));
});

test("same-account token refresh or profile edits retain cached data", (t) => {
  const client = clientFor(t);
  const keys = seedPrivateData(client, "account-a");
  const state = client.getQueryState(keys[0]);
  removeOtherUserQueries(client, "account-a");
  assert.strictEqual(client.getQueryState(keys[0]), state);
  for (const key of keys) assert.ok(client.getQueryData(key));
});

test("logout and expired sessions remove private queries without persisting them", (t) => {
  const client = clientFor(t);
  seedPrivateData(client, "account-a");
  client.setQueryData(["auth", "config"], { googleClientId: "public-client-id" });
  removeOtherUserQueries(client, null);
  assert.deepEqual(client.getQueryCache().getAll().map((query) => query.queryKey), [["auth", "config"]]);
});

test("late responses from a previous account cannot repopulate its removed cache", async (t) => {
  const client = clientFor(t);
  const oldKey = queryKeys.courses("account-a");
  let finish;
  const pending = client.fetchQuery({
    queryKey: oldKey,
    queryFn: () => new Promise((resolve) => { finish = resolve; }),
  });
  const settled = pending.catch(() => undefined);
  // A cancelled query may schedule GC in its async finally after removal.
  const outgoingQuery = client.getQueryCache().find({ queryKey: oldKey });
  t.after(() => outgoingQuery.destroy());
  removeOtherUserQueries(client, "account-b");
  finish(["late private response"]);
  await settled;
  assert.equal(client.getQueryState(oldKey), undefined);
  assert.equal(client.getQueryData(queryKeys.courses("account-b")), undefined);
});

test("cleanup does not cancel a request already started by the incoming account", async (t) => {
  const client = clientFor(t);
  seedPrivateData(client, "account-a");
  const key = queryKeys.courses("account-b");
  let finish;
  const pending = client.fetchQuery({
    queryKey: key,
    queryFn: () => new Promise((resolve) => { finish = resolve; }),
  });
  removeOtherUserQueries(client, "account-b");
  assert.equal(client.getQueryState(key).fetchStatus, "fetching");
  finish(["current account"]);
  await pending;
  assert.deepEqual(client.getQueryData(key), ["current account"]);
});

test("resume is marked stale without fetching during playback", async (t) => {
  const client = clientFor(t);
  const key = queryKeys.resume("video-1", "account-a");
  const otherVideo = queryKeys.resume("video-2", "account-a");
  const otherAccount = queryKeys.resume("video-1", "account-b");
  for (const item of [key, otherVideo, otherAccount]) {
    client.setQueryData(item, { currentTime: 12 });
  }
  let requests = 0;
  const stop = observe(client, {
    queryKey: key,
    queryFn: async () => { requests++; return { currentTime: 24 }; },
  });
  try {
    await invalidateResume(client, "account-a", "video-1");
    assert.equal(requests, 0);
    assert.equal(client.getQueryState(key).isInvalidated, true);
    assert.equal(client.getQueryState(otherVideo).isInvalidated, false);
    assert.equal(client.getQueryState(otherAccount).isInvalidated, false);
  } finally {
    stop();
  }
  await client.fetchQuery({
    queryKey: key,
    queryFn: async () => { requests++; return { currentTime: 24 }; },
  });
  assert.equal(requests, 1);
});

test("course deletion can stale all resumes for one account without active refetch", async (t) => {
  const client = clientFor(t);
  seedPrivateData(client, "account-a");
  seedPrivateData(client, "account-b");
  client.setQueryData(queryKeys.resume("video-2", "account-a"), {});
  await invalidateResume(client, "account-a");
  assert.equal(client.getQueryState(queryKeys.resume("video-1", "account-a")).isInvalidated, true);
  assert.equal(client.getQueryState(queryKeys.resume("video-2", "account-a")).isInvalidated, true);
  assert.equal(client.getQueryState(queryKeys.resume("video-1", "account-b")).isInvalidated, false);
});

test("unknown mutation owners never invalidate the current account", async (t) => {
  const client = clientFor(t);
  const keys = seedPrivateData(client, "account-a");
  await invalidateUserData(client, undefined, ["courses", "folders"]);
  await invalidateResume(client, null);
  for (const key of keys) assert.equal(client.getQueryState(key).isInvalidated, false);
});

test("a new provider/request starts with an empty independent cache", (t) => {
  const first = clientFor(t);
  const second = clientFor(t);
  seedPrivateData(first, "account-a");
  assert.equal(second.getQueryCache().getAll().length, 0);
});
