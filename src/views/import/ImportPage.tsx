"use client";

import { useState } from "react";
import { Link2 } from "lucide-react";
import { toast } from "sonner";
import * as motion from "framer-motion/m";

import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useYoutubePreview } from "@/hooks/youtube/useYoutubePreview";
import { useImportYoutube } from "@/hooks/youtube/useImportYoutube";
import { PreviewCard } from "@/components/Import/PreviewCard";

import { getErrorMessage } from "@/utils/get-error-message";

export default function ImportPage() {
  const [url, setUrl] = useState("");

  const previewMutation = useYoutubePreview();
  const importMutation = useImportYoutube();

  const handlePreview = () => {
    if (!url.trim()) {
      toast.error("Please enter a YouTube URL");
      return;
    }

    previewMutation.mutate(url, {
      onError: (error) => {
        toast.error(getErrorMessage(error));
      },
    });
  };

  const router = useRouter();

  const handleImport = () => {
    importMutation.mutate(url, {
      onSuccess: () => {
        toast.success("Course imported successfully");
        router.push(ROUTES.COURSES);
      },
      onError: (error) => {
        toast.error(getErrorMessage(error));
      },
    });
  };

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col items-center pt-2 sm:pt-8 lg:pt-16">
      <motion.div
        className="mb-6 text-center sm:mb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.4, delay: 0.1 }}
      >
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl text-foreground">
          Import YouTube Course
        </h1>

        <p className="text-muted-foreground mt-2 text-sm sm:mt-3 sm:text-base">
          Paste any YouTube playlist or single video and
          continue learning distraction-free.
        </p>
      </motion.div>

      <motion.div
        className="lp-clay-card lp-clay-white w-full max-w-3xl rounded-3xl border-border/60"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.4, delay: 0.2 }}
      >
        <div className="space-y-5 p-4 sm:space-y-6 sm:p-8">
          <div className="relative">
            <Link2 className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

            <Input
              placeholder="Paste YouTube playlist or video URL..."
              className="lp-clay-input h-14 rounded-2xl pr-4 pl-12 text-base"
              value={url}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handlePreview();
                }
              }}
              onChange={(e) => setUrl(e.target.value)}
              disabled={
                previewMutation.isPending ||
                importMutation.isPending
              }
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
            <Button
              className="lp-clay-btn lp-clay-btn-primary h-12 w-full rounded-2xl sm:flex-1"
              onClick={handlePreview}
              disabled={previewMutation.isPending}
            >
              {previewMutation.isPending ? "Previewing..." : "Preview Course"}
            </Button>

            <Button
              className="lp-clay-btn lp-clay-btn-primary h-12 w-full rounded-2xl sm:flex-1"
              onClick={handleImport}
              disabled={
                !previewMutation.data ||
                importMutation.isPending
              }
            >
              {importMutation.isPending
                ? "Importing..."
                : "✨ Import Course"}
            </Button>
          </div>
        </div>
      </motion.div>

      {previewMutation.data && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.4, delay: 0.3 }}
        >
          <PreviewCard preview={previewMutation.data} />
        </motion.div>
      )}
    </div>
  );
}