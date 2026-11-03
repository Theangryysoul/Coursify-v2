import type { NextRequest } from "next/server";

import { requireUserId } from "@/lib/server/auth";
import { handleRoute, successResponse } from "@/lib/server/http";
import {
  deleteImage,
  uploadAvatar,
} from "@/lib/server/services/upload.service";
import {
  getCurrentUser,
  removeAvatar,
  updateAvatar,
} from "@/lib/server/services/user.service";
import { BadRequestError } from "@/lib/server/utils/errors";

const MAX_AVATAR_BYTES = 300 * 1024;

export async function PATCH(request: NextRequest) {
  return handleRoute(async () => {
    const userId = requireUserId(request);
    const formData = await request.formData();
    const image = formData.get("image");

    if (!(image instanceof File)) {
      throw new BadRequestError("Image is required");
    }

    if (!image.type.startsWith("image/")) {
      throw new BadRequestError("Only image files are allowed");
    }

    if (image.size > MAX_AVATAR_BYTES) {
      throw new BadRequestError("Image must be 300 KB or smaller");
    }

    const currentUser = await getCurrentUser(userId);

    if (currentUser.avatar?.publicId) {
      await deleteImage(currentUser.avatar.publicId);
    }

    const avatar = await uploadAvatar(
      Buffer.from(await image.arrayBuffer())
    );

    const updatedUser = await updateAvatar(userId, avatar);

    return successResponse("Avatar updated successfully", updatedUser);
  });
}

export async function DELETE(request: NextRequest) {
  return handleRoute(async () => {
    const userId = requireUserId(request);
    const currentUser = await getCurrentUser(userId);

    if (currentUser.avatar?.publicId) {
      await deleteImage(currentUser.avatar.publicId);
    }

    const updatedUser = await removeAvatar(userId);

    return successResponse("Avatar removed successfully", updatedUser);
  });
}
