"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Button } from "@/components/ui/button";

import { useUploadAvatar } from "@/hooks/user/useUploadAvatar";
import { useDeleteAvatar } from "@/hooks/user/useDeleteAvatar";
import { useAuthStore } from "@/store/auth.store";
import { compressAvatar } from "@/utils/compress-avatar";
import { getErrorMessage } from "@/utils/get-error-message";
import { toast } from "sonner";

export function ChangeAvatarDialog() {
  const uploadAvatar = useUploadAvatar();

  const user = useAuthStore((state) => state.user);

  // A missing avatar comes back from the API as an empty string.
  const fallbackAvatar =
    "https://ui-avatars.com/api/?name=" +
    encodeURIComponent(user?.name ?? "U");

  const inputRef = useRef<HTMLInputElement>(null);

  const [open, setOpen] = useState(false);

  const [file, setFile] = useState<File>();

  const [preview, setPreview] = useState(user?.avatar?.url);

  const [isOptimizing, setIsOptimizing] = useState(false);

  const selectionRef = useRef(0);

  // Reset the preview to the saved avatar each time the dialog opens.
  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      setPreview(user?.avatar?.url);
    }

    setOpen(nextOpen);
  };

  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];

    if (!selected) return;

    const selection = selectionRef.current + 1;
    selectionRef.current = selection;

    setPreview(URL.createObjectURL(selected));
    setFile(undefined);
    setIsOptimizing(true);

    try {
      const optimized = await compressAvatar(selected);

      if (selectionRef.current !== selection) return;

      setFile(optimized);
    } catch (error) {
      if (selectionRef.current !== selection) return;

      toast.error(getErrorMessage(error));

      setPreview(user?.avatar?.url);

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    } finally {
      if (selectionRef.current === selection) {
        setIsOptimizing(false);
      }
    }
  };

  const handleUpload = () => {
    if (!file) return;

    uploadAvatar.mutate(file, {
      onSuccess: () => {
        toast.success("Avatar updated successfully.");

        setOpen(false);
        setFile(undefined);

        if (inputRef.current) {
          inputRef.current.value = "";
        }
      },

      onError: (error) => {
        toast.error(getErrorMessage(error));
      },
    });
  };

  const deleteAvatar = useDeleteAvatar();

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="lg"
          className="lp-clay-btn lp-clay-btn-secondary h-10 w-40 rounded-xl px-6 text-base font-medium"
        >
          Change Avatar
        </Button>
      </DialogTrigger>

      <DialogContent className="lp-clay-card lp-clay-white rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-foreground">Change Avatar</DialogTitle>
        </DialogHeader>

        <div
          className="flex flex-col items-center gap-6"
          onKeyDown={(e) => {
            if (
              e.key === "Enter" &&
              file &&
              !isOptimizing &&
              !uploadAvatar.isPending
            ) {
              e.preventDefault();
              handleUpload();
            }
          }}
        >
          <img
            src={preview || fallbackAvatar}
            alt="Avatar Preview"
            className="lp-clay-card lp-clay-white h-36 w-36 rounded-full border-4 object-cover"
            style={{ borderColor: "var(--lp-coral)" }}
          />

          <input
            ref={inputRef}
            hidden
            type="file"
            accept="image/*"
            onChange={handleSelect}
          />

          <Button
            type="button"
            variant="outline"
            size="lg"
            className="lp-clay-btn lp-clay-btn-secondary h-10 rounded-xl px-6 text-base font-medium"
            disabled={isOptimizing}
            onClick={() => inputRef.current?.click()}
          >
            Choose Image
          </Button>

          <p className="text-muted-foreground text-center text-sm">
            Any size works — we shrink it to under 300 KB for you.
          </p>

          <Button
            type="submit"
            size="lg"
            className="lp-clay-btn lp-clay-btn-primary h-10 w-full rounded-xl px-6 text-base font-medium"
            disabled={!file || isOptimizing || uploadAvatar.isPending}
            onClick={handleUpload}
          >
            {isOptimizing ? (
              <>
                <div className="lp-spinner h-4 w-4">
                  <Loader2 className="h-4 w-4" style={{ color: "white" }} />
                </div>
                Optimizing…
              </>
            ) : (
              "Upload Avatar"
            )}
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                type="button"
                variant="destructive"
                className="lp-clay-btn lp-clay-btn-primary bg-destructive hover:bg-destructive/80 h-10 w-full rounded-xl px-6 text-base font-medium"
              >
                Delete Avatar
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent className="lp-clay-card lp-clay-white rounded-3xl">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-foreground">Delete Avatar?</AlertDialogTitle>

                <AlertDialogDescription className="text-muted-foreground">
                  This will permanently remove your profile picture.
                  You can upload a new one anytime.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel className="lp-clay-btn lp-clay-btn-secondary h-9 rounded-xl px-5 text-base font-medium">
                  Cancel
                </AlertDialogCancel>

                <AlertDialogAction
                  className="lp-clay-btn lp-clay-btn-primary bg-destructive hover:bg-destructive/80 h-9 rounded-xl px-5 text-base font-medium"
                  onClick={() =>
                    deleteAvatar.mutate(undefined, {
                      onSuccess: () => {
                        toast.success("Avatar removed successfully.");

                        setFile(undefined);
                        setPreview(undefined);

                        if (inputRef.current) {
                          inputRef.current.value = "";
                        }

                        setOpen(false);
                      },
                    })
                  }
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </DialogContent>
    </Dialog>
  );
}