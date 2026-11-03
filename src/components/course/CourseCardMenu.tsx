"use client";

import { useState } from "react";
import { Check, FolderInput, MoreVertical, Trash2 } from "lucide-react";
import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import type { CourseItem } from "@/types/course";
import { useFolders } from "@/hooks/folder/useFolders";
import { useDeleteCourse } from "@/hooks/course/useDeleteCourse";
import { useSetCourseFolder } from "@/hooks/course/useSetCourseFolder";
import { cn } from "@/lib/utils";
import { getErrorMessage } from "@/utils/get-error-message";
import { getFolderDotClass } from "@/components/folder/folder-colors";

interface CourseCardMenuProps {
  course: CourseItem;
}

/**
 * The per-course actions: file the course into a folder, or remove it from the
 * library. Kept beside the card rather than on the detail page so a whole
 * library can be tidied without opening each course.
 */
export function CourseCardMenu({ course }: CourseCardMenuProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const { data: folders } = useFolders();

  const deleteCourse = useDeleteCourse();
  const setCourseFolder = useSetCourseFolder();

  const currentFolderId = course.folder ?? null;

  const handleMove = (folderId: string | null) => {
    if (folderId === currentFolderId) {
      return;
    }

    setCourseFolder.mutate(
      { courseId: course.course._id, folderId },
      {
        onSuccess: () => {
          const name = folders?.find((folder) => folder._id === folderId)?.name;

          toast.success(
            folderId ? `Moved to "${name}"` : "Moved to Uncategorised"
          );
        },
        onError: (error) => {
          toast.error(getErrorMessage(error));
        },
      }
    );
  };

  const handleDelete = () => {
    deleteCourse.mutate(course.course._id, {
      onSuccess: () => {
        toast.success("Course removed");

        setConfirmOpen(false);
      },
      onError: (error) => {
        toast.error(getErrorMessage(error));

        setConfirmOpen(false);
      },
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            aria-label="Course options"
            className="lp-clay-card lp-clay-white absolute top-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full text-[var(--lp-coral)] transition-colors hover:text-[var(--foreground)]"
          >
            <MoreVertical className="h-4 w-4" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          sideOffset={8}
          variant="clay"
          className="w-56"
        >
          <DropdownMenuLabel className="text-muted-foreground px-3 py-2 text-xs font-medium tracking-wide uppercase">
            Manage
          </DropdownMenuLabel>

          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="lp-clay-btn lp-clay-btn-ghost w-full justify-start rounded-xl px-3 py-2.5">
              <FolderInput className="mr-3 h-4 w-4" style={{ color: "var(--lp-lavender)" }} />
              Move to folder
            </DropdownMenuSubTrigger>

            <DropdownMenuSubContent variant="clay" className="w-56">
              <DropdownMenuItem
                className="lp-clay-btn lp-clay-btn-ghost w-full justify-start rounded-xl px-3 py-2.5"
                onSelect={() => handleMove(null)}
              >
                <span className="mr-3 h-2.5 w-2.5 rounded-full bg-muted-foreground/60" />

                <span className="flex-1">Uncategorised</span>

                {currentFolderId === null && (
                  <Check className="ml-2 h-4 w-4" style={{ color: "var(--lp-mint)" }} />
                )}
              </DropdownMenuItem>

              {folders?.map((folder) => (
                <DropdownMenuItem
                  key={folder._id}
                  className="lp-clay-btn lp-clay-btn-ghost w-full justify-start rounded-xl px-3 py-2.5"
                  onSelect={() => handleMove(folder._id)}
                >
                  <span
                    className={cn(
                      "mr-3 h-2.5 w-2.5 rounded-full",
                      getFolderDotClass(folder.color)
                    )}
                  />

                  <span className="flex-1 truncate">{folder.name}</span>

                  {currentFolderId === folder._id && (
                    <Check className="ml-2 h-4 w-4" style={{ color: "var(--lp-mint)" }} />
                  )}
                </DropdownMenuItem>
              ))}

              {!folders?.length && (
                <DropdownMenuItem
                  disabled
                  className="lp-clay-btn lp-clay-btn-ghost w-full justify-start rounded-xl px-3 py-2.5 text-muted-foreground"
                >
                  No folders yet
                </DropdownMenuItem>
              )}
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            variant="destructive"
            className="lp-clay-btn lp-clay-btn-ghost w-full justify-start rounded-xl px-3 py-2.5 text-[var(--lp-coral)] hover:bg-[var(--lp-peach-bg)]"
            onSelect={(event) => {
              event.preventDefault();
              setConfirmOpen(true);
            }}
          >
            <Trash2 className="mr-3 h-4 w-4" style={{ color: "var(--lp-coral)" }} />
            Remove course
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent variant="clay">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">
              Remove this course?
            </AlertDialogTitle>

            <AlertDialogDescription className="text-muted-foreground">
              &ldquo;{course.course.title}&rdquo; and its watch progress are removed from
              your library. Your data for other courses is untouched.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel className="lp-clay-btn lp-clay-btn-secondary">Keep course</AlertDialogCancel>

            <AlertDialogAction
              variant="destructive"
              className="lp-clay-btn lp-clay-btn-primary bg-destructive hover:bg-destructive/80"
              disabled={deleteCourse.isPending}
              onClick={handleDelete}
            >
              {deleteCourse.isPending ? "Removing..." : "Remove course"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}