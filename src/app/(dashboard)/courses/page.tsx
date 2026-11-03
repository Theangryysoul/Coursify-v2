import type { Metadata } from "next";

import CoursesPage from "@/views/courses/CoursesPage";

export const metadata: Metadata = {
  title: "Courses",
};

export default function Page() {
  return <CoursesPage />;
}
