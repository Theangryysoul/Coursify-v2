"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";

import { useCourseDetails } from "@/hooks/course/useCourseDetails";
import { useResume } from "@/hooks/progress/useResume";
import { useUpdateProgress } from "@/hooks/progress/useUpdateProgress";

import { CourseHeader } from "@/components/course/CourseHeader";
import { CoursePlayer } from "@/components/course/CoursePlayer";
import { LectureItem } from "@/components/course/LectureItem";

const formatSeconds = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.round(seconds % 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`;
  }

  return `${minutes}m ${secs}s`;
};

export default function CourseDetailsPage() {
  const { courseId } = useParams<{ courseId: string }>();

  const { data, isPending } = useCourseDetails(courseId ?? "");

  const [currentVideo, setCurrentVideo] = useState(0);

  useEffect(() => {
    if (data?.videos.length && currentVideo >= data.videos.length) {
      // Clamp the selection once the loaded playlist turns out to be shorter
      // than the index left over from a previous course.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCurrentVideo(0);
    }
  }, [data?.videos.length, currentVideo]);

  const activeVideo = data?.videos[currentVideo];

  const { data: resume } = useResume(activeVideo?.videoId ?? "");
  const activeLectureRef = useRef<HTMLDivElement | null>(null);
  const isFirstQueueRender = useRef(true);

  // Keep the selected row visible inside the queue without moving the page on
  // first load.
  useEffect(() => {
    if (isFirstQueueRender.current) {
      isFirstQueueRender.current = false;
      return;
    }

    activeLectureRef.current?.scrollIntoView({
      block: "nearest",
      behavior: "smooth",
    });
  }, [currentVideo]);

  useEffect(() => {
    if (!data?.resume) return;

    const index = data.videos.findIndex(
      (video) => video._id === data.resume?.videoId
    );

    if (index !== -1) {
      // Jump to the saved resume point as soon as the course arrives.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCurrentVideo(index);
    }
  }, [data]);

  const updateProgress = useUpdateProgress();
  const queryClient = useQueryClient();

  const handleProgress = (
    currentTime: number,
    duration: number,
    start: number,
    end: number
  ) => {
    if (!activeVideo) return;

    if (updateProgress.isPending) return;

    updateProgress.mutate({
      videoId: activeVideo.videoId,
      data: {
        currentTime,
        duration,
        segment: { start, end },
      },
    });
  };

  const handleCompleted = async () => {
    if (!data) return;

    await queryClient.invalidateQueries({
      queryKey: ["course-details", courseId],
    });

    await queryClient.invalidateQueries({
      queryKey: ["courses"],
    });

    if (currentVideo < data.videos.length - 1) {
      setCurrentVideo((prev) => prev + 1);
    }
  };

  if (isPending) {
    return (
      <motion.div
        className="mx-auto flex w-full max-w-7xl flex-col gap-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="lp-clay-card lp-clay-white text-center py-20 rounded-3xl">
          Loading course...
        </div>
      </motion.div>
    );
  }

  if (!data || !activeVideo) {
    return (
      <motion.div
        className="mx-auto flex w-full max-w-7xl flex-col gap-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="lp-clay-card lp-clay-white text-center py-20 rounded-3xl">
          Course not found.
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="mx-auto flex w-full max-w-7xl flex-col gap-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <CourseHeader
          title={data.userCourse.course.title}
          progress={data.progress}
          duration={`${formatSeconds(data.progress.watchedDuration)} / ${formatSeconds(data.progress.totalDuration)}`}
        />
      </motion.div>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_21rem] xl:grid-cols-[minmax(0,1fr)_23rem]">
        {/* Player */}
        <motion.div
          className="flex min-w-0 flex-col gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <CoursePlayer
            videoId={activeVideo.videoId}
            title={activeVideo.title}
            resumeTime={resume?.currentTime}
            onProgress={handleProgress}
            onCompleted={handleCompleted}
          />

          <div className="lp-clay-card lp-clay-white flex items-center justify-between gap-4 rounded-2xl px-5 py-4">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Now playing
              </p>

              <p className="mt-1 truncate font-semibold text-foreground">
                {activeVideo.title}
              </p>
            </div>

            <span className="shrink-0 text-sm text-muted-foreground">
              {currentVideo + 1} / {data.videos.length}
            </span>
          </div>
        </motion.div>

        {/* Queue */}
        <motion.aside
          className="lp-clay-card lp-clay-white flex min-h-0 flex-col rounded-3xl p-3 lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          aria-label="Course queue"
        >
          <div className="flex items-center justify-between px-2 pb-3 pt-1">
            <h2 className="text-lg font-semibold text-foreground">Up next</h2>

            <span className="text-xs text-muted-foreground">
              {data.videos.length} Video
              {data.videos.length > 1 ? "s" : ""}
            </span>
          </div>

          <div className="min-h-0 flex-1 space-y-1 overflow-y-auto pr-1">
            {data.videos.map((lecture, index) => (
              <LectureItem
                ref={currentVideo === index ? activeLectureRef : null}
                key={lecture._id}
                lecture={lecture}
                active={currentVideo === index}
                onClick={() => setCurrentVideo(index)}
              />
            ))}
          </div>
        </motion.aside>
      </div>
    </motion.div>
  );
}