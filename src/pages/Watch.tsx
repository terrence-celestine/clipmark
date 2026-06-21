import { useParams } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { db } from "../db";
import type { Video, Chapter } from "../types";
import { getChaptersByVideo, updateVideo } from "../db/helpers";
import YouTubePlayer from "../components/watch/YoutubePlayer";

export default function Watch() {
  const { videoId } = useParams<{ videoId: string }>();
  const [video, setVideo] = useState<Video | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);

  useEffect(() => {
    if (!videoId) return;
    db.videos
      .where("youtubeId")
      .equals(videoId)
      .first()
      .then((v) => {
        if (v) setVideo(v);
      });
  }, [videoId]);

  useEffect(() => {
    if (!video?.id) return;
    getChaptersByVideo(video.id).then(setChapters);
  }, [video]);

  const handleTimeUpdate = useCallback(
    (time: number) => {
      if (!video?.id) return;
      updateVideo(video.id, { lastTimestamp: time, lastWatchedAt: Date.now() });
    },
    [video],
  );

  const handleMarkChapter = useCallback((time: number) => {
    console.log("mark chapter at", time);
  }, []);

  if (!video) return <div className="p-8 text-[#999]">Loading...</div>;

  return (
    <div className="flex flex-1 overflow-hidden h-[calc(100vh-52px)]">
      <div className="flex-1 flex flex-col">
        <YouTubePlayer
          videoId={video.youtubeId}
          duration={video.duration}
          startAt={video.lastTimestamp}
          chapterTimestamps={chapters.map((c) => c.timestamp)}
          onTimeUpdate={handleTimeUpdate}
          onMarkChapter={handleMarkChapter}
        />
        <div className="px-4 py-3 bg-white border-t border-[#EFEFEF]">
          <p className="text-[13px] font-medium text-[#111]">{video.title}</p>
          <p className="text-[11px] text-[#888] mt-1">{video.channelName}</p>
        </div>
      </div>
      <div className="w-[272px] bg-white border-l border-[#EFEFEF]">
        Sidebar
      </div>
    </div>
  );
}
