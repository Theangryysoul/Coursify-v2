import type { NextRequest } from "next/server";

import { requireUserId } from "@/lib/server/auth";
import {
  handleRoute,
  parseBody,
  successResponse,
} from "@/lib/server/http";
import { requireObjectId } from "@/lib/server/ids";
import {
  deleteFolder,
  updateFolder,
} from "@/lib/server/services/folder.service";
import { updateFolderSchema } from "@/lib/server/validators/folder.validator";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  return handleRoute(async () => {
    const userId = requireUserId(request);
    const { id } = await params;
    const body = parseBody(updateFolderSchema, await request.json());

    const folder = await updateFolder(
      userId,
      requireObjectId(id, "Folder not found"),
      body
    );

    return successResponse("Folder updated successfully", folder);
  });
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  return handleRoute(async () => {
    const userId = requireUserId(request);
    const { id } = await params;

    await deleteFolder(userId, requireObjectId(id, "Folder not found"));

    return successResponse("Folder deleted successfully");
  });
}
