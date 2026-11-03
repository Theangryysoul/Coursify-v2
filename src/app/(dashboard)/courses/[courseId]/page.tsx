import type { Metadata } from "next";

import CourseDetailsPage from "@/views/courses/CourseDetailsPage";

export const metadata: Metadata = {
  title: "Course",
};

export default function Page() {
  return <CourseDetailsPage />;
}
