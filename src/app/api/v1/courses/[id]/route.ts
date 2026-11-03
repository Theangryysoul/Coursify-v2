import type { NextRequest } from "next/server";

import { requireUserId } from "@/lib/server/auth";
import { handleRoute, successResponse } from "@/lib/server/http";
import { requireObjectId } from "@/lib/server/ids";
import {
  deleteCourse,
  getCourseById,
  updateCourse,
} from "@/lib/server/services/course.service";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: RouteContext) {
  return handleRoute(async () => {
    const userId = requireUserId(request);
    const { id } = await params;

    const course = await getCourseById(
      userId,
      requireObjectId(id, "Course not found")
    );

    return successResponse("Course fetched successfully", course);
  });
}

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  return handleRoute(async () => {
    const userId = requireUserId(request);
    const { id } = await params;

    const course = await updateCourse(
      userId,
      requireObjectId(id, "Course not found"),
      await request.json()
    );

    return successResponse("Course updated successfully", course);
  });
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  return handleRoute(async () => {
    const userId = requireUserId(request);
    const { id } = await params;

    await deleteCourse(userId, requireObjectId(id, "Course not found"));

    return successResponse("Course removed successfully");
  });
}
