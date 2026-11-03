import type { NextRequest } from "next/server";

import { requireUserId } from "@/lib/server/auth";
import {
  handleRoute,
  parseBody,
  successResponse,
} from "@/lib/server/http";
import {
  createFolder,
  getFolders,
} from "@/lib/server/services/folder.service";
import { createFolderSchema } from "@/lib/server/validators/folder.validator";

export async function GET(request: NextRequest) {
  return handleRoute(async () => {
    const userId = requireUserId(request);
    const folders = await getFolders(userId);

    return successResponse("Folders fetched successfully", folders);
  });
}

export async function POST(request: NextRequest) {
  return handleRoute(async () => {
    const userId = requireUserId(request);
    const body = parseBody(createFolderSchema, await request.json());
    const folder = await createFolder(userId, body);

    return successResponse("Folder created successfully", folder, 201);
  });
}
