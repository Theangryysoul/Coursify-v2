"use client";

import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { BookOpen, SearchX } from "lucide-react";
import * as motion from "framer-motion/m";

import { useCourses } from "@/hooks/course/useCourses";
import { useFolders } from "@/hooks/folder/useFolders";

import { CourseCard } from "@/components/course/CourseCard";
import { CreateFolderDialog } from "@/components/folder/CreateFolderDialog";
import {
  FolderFilterBar,
  type FolderSelection,
} from "@/components/folder/FolderFilterBar";
import { Button } from "@/components/ui/button";

import { ROUTES } from "@/constants/routes";

export default function CoursesPage() {
  const { data, isPending } = useCourses();
  const { data: folders } = useFolders();

  const [selected, setSelected] = useState<FolderSelection>("all");

  const courses = useMemo(() => data ?? [], [data]);

  const uncategorisedCount = useMemo(
    () => courses.filter((course) => !course.folder).length,
    [courses]
  );

  const visibleCourses = useMemo(() => {
    if (selected === "all") {
      return courses;
    }

    if (selected === "uncategorised") {
      return courses.filter((course) => !course.folder);
    }

    return courses.filter((course) => course.folder === selected);
  }, [courses, selected]);

  const selectedFolder =
    selected !== "all" && selected !== "uncategorised"
      ? folders?.find((folder) => folder._id === selected)
      : undefined;

  const hasFolders = Boolean(folders?.length) || uncategorisedCount > 0;

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <motion.div
        className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.4, delay: 0.1 }}
      >
        <div>
          <h1 className="text-3xl font-bold sm:text-4xl text-foreground">
            My Courses
          </h1>

          <p className="text-muted-foreground mt-2">
            Continue learning where you left off.
          </p>
        </div>

        <CreateFolderDialog />
      </motion.div>

      {hasFolders && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.4, delay: 0.2 }}
        >
          <FolderFilterBar
            folders={folders ?? []}
            totalCount={courses.length}
            uncategorisedCount={uncategorisedCount}
            selected={selected}
            onSelect={setSelected}
          />
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.4, delay: 0.3 }}
      >
        {isPending ? (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="lp-clay-card lp-clay-white lp-loading-pulse overflow-hidden rounded-3xl"
                style={{ animationDelay: `${item * 200}ms` }}
              >
                <div className="aspect-video w-full bg-gradient-to-r from-[#f0ecec] to-[#e8e0e8]" />
                <div className="space-y-3 p-5">
                  <div className="h-5 w-3/4 animate-pulse rounded bg-gradient-to-r from-[#f0ecec] to-[#e8e0e8]" />
                  <div className="h-2 w-full animate-pulse rounded bg-gradient-to-r from-[#f0ecec] to-[#e8e0e8]" />
                  <div className="h-9 w-full animate-pulse rounded bg-gradient-to-r from-[#f0ecec] to-[#e8e0e8]" />
                </div>
              </div>
            ))}
          </div>
        ) : !courses.length ? (
          <EmptyState
            icon={<BookOpen className="h-8 w-8" style={{ color: "var(--lp-coral)" }} />}
            title="No courses imported yet"
            description="Import a YouTube playlist or a single video to start building your library."
            action={
              <Button asChild className="lp-clay-btn lp-clay-btn-primary rounded-xl">
                <Link href={ROUTES.IMPORT}>Import a course</Link>
              </Button>
            }
          />
        ) : !visibleCourses.length ? (
          <EmptyState
            icon={<SearchX className="h-8 w-8" style={{ color: "var(--lp-lavender)" }} />}
            title={
              selectedFolder
                ? `"${selectedFolder.name}" is empty`
                : "Nothing here yet"
            }
            description="Use the menu on a course card to move it into this folder."
            action={
              <Button
                variant="outline"
                className="lp-clay-btn lp-clay-btn-secondary rounded-xl"
                onClick={() => setSelected("all")}
              >
                Show all courses
              </Button>
            }
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {visibleCourses.map((course, index) => (
              <CourseCard
                key={course._id}
                course={course}
                index={index}
              />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}

function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <motion.div
      className="lp-clay-card lp-clay-white flex flex-col items-center justify-center rounded-3xl border border-dashed p-12 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.4 }}
    >
      <div className="lp-clay-icon lp-clay-peach mb-5">
        {icon}
      </div>

      <h3 className="text-xl font-semibold text-foreground">{title}</h3>

      <p className="text-muted-foreground mt-2 max-w-md">{description}</p>

      {action && <div className="mt-6">{action}</div>}
    </motion.div>
  );
}