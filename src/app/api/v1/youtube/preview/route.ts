import type { NextRequest } from "next/server";

import { requireUserId } from "@/lib/server/auth";
import {
  handleRoute,
  parseBody,
  successResponse,
} from "@/lib/server/http";
import { isYoutubeRequestAllowed } from "@/lib/server/rate-limit";
import {
  detectYoutubeUrlType,
  extractPlaylistId,
  extractVideoId,
  formatPlaylistMetadata,
  formatPlaylistVideos,
  formatVideoMetadata,
  getPlaylistMetadata,
  getPlaylistVideos,
  getVideoDetails,
  getVideoMetadata,
  mergeVideoDetails,
} from "@/lib/server/services/youtube.service";
import { BadRequestError } from "@/lib/server/utils/errors";
import { youtubeUrlSchema } from "@/lib/server/validators/youtube.validator";

type PlaylistVideo = {
  videoId: string;
  title: string;
  thumbnail: string;
  position: number;
};

export async function POST(request: NextRequest) {
  return handleRoute(async () => {
    const userId = requireUserId(request);

    if (!isYoutubeRequestAllowed(userId)) {
      throw new BadRequestError(
        "Too many YouTube requests. Please wait a few minutes and try again."
      );
    }

    const { url } = parseBody(youtubeUrlSchema, await request.json());
    const type = detectYoutubeUrlType(url);

    let data = null;

    if (type === "playlist") {
      const playlistId = extractPlaylistId(url)!;

      const rawMetadata = await getPlaylistMetadata(playlistId);
      const rawVideos = await getPlaylistVideos(playlistId);

      const videos: PlaylistVideo[] = formatPlaylistVideos(rawVideos);

      const details = await getVideoDetails(videos.map((v) => v.videoId));

      const completeVideos = mergeVideoDetails(videos, details);

      data = {
        ...formatPlaylistMetadata(rawMetadata),
        videos: completeVideos,
      };
    } else {
      const videoId = extractVideoId(url)!;

      const rawVideo = await getVideoMetadata(videoId);

      data = formatVideoMetadata(rawVideo);
    }

    return successResponse("Preview fetched successfully", { type, data });
  });
}
