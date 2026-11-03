import type { NextRequest } from "next/server";

import { requireUserId } from "@/lib/server/auth";
import {
  handleRoute,
  parseBody,
  successResponse,
} from "@/lib/server/http";
import { requireObjectId } from "@/lib/server/ids";
import { setCourseFolder } from "@/lib/server/services/course.service";
import { assignFolderSchema } from "@/lib/server/validators/folder.validator";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  return handleRoute(async () => {
    const userId = requireUserId(request);
    const { id } = await params;
    const body = parseBody(assignFolderSchema, await request.json());

    const course = await setCourseFolder(
      userId,
      requireObjectId(id, "Course not found"),
      body.folderId ?? null
    );

    return successResponse("Course moved successfully", course);
  });
}
