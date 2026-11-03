import type { NextRequest } from "next/server";

import { requireUserId } from "@/lib/server/auth";
import { handleRoute, successResponse } from "@/lib/server/http";
import { getMyCourses } from "@/lib/server/services/course.service";

export async function GET(request: NextRequest) {
  return handleRoute(async () => {
    const userId = requireUserId(request);
    const courses = await getMyCourses(userId);

    return successResponse("Courses fetched successfully", courses);
  });
}
