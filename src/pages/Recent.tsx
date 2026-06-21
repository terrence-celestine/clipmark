import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Clock } from "lucide-react";
import { getVideos } from "../db/helpers";
import type { Video } from "../types";
import VideoCard from "../components/home/VideoCard";
import {
  getCollections,
  getChaptersByVideo,
  updateVideo,
  deleteVideo,
} from "../db/helpers";
import type { Collection } from "../types";

function timeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export default function Recent() {
  const navigate = useNavigate();
  const [videos, setVideos] = useState<Video[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [chapterCounts, setChapterCounts] = useState<Record<number, number>>(
    {},
  );

  useEffect(() => {
    getCollections().then(setCollections);
    getVideos().then(async (vids) => {
      const watched = vids
        .filter((v) => v.lastWatchedAt && v.lastWatchedAt > 0)
        .sort((a, b) => (b.lastWatchedAt ?? 0) - (a.lastWatchedAt ?? 0));
      setVideos(watched);
      const counts: Record<number, number> = {};
      await Promise.all(
        watched.map(async (v) => {
          if (v.id) {
            const chapters = await getChaptersByVideo(v.id);
            counts[v.id] = chapters.length;
          }
        }),
      );
      setChapterCounts(counts);
    });
  }, []);

  const handleToggleComplete = async (video: Video) => {
    if (!video.id) return;
    await updateVideo(video.id, { completed: !video.completed });
    setVideos((vs) =>
      vs.map((v) =>
        v.id === video.id ? { ...v, completed: !v.completed } : v,
      ),
    );
  };

  const handleDeleteVideo = async (video: Video) => {
    if (!video.id) return;
    await deleteVideo(video.id);
    setVideos((vs) => vs.filter((v) => v.id !== video.id));
  };

  const handleMoveToCollection = async (
    video: Video,
    collectionId: number | undefined,
  ) => {
    if (!video.id) return;
    await updateVideo(video.id, { collectionId });
    setVideos((vs) =>
      vs.map((v) => (v.id === video.id ? { ...v, collectionId } : v)),
    );
  };

  return (
    <div className="flex flex-col flex-1 ">
      <div className="bg-white border-b border-[#EFEFEF] px-5 pt-5 pb-4">
        <div className="flex items-center gap-2 mb-1">
          <Clock size={16} color="#4F46E5" />
          <h1 className="text-[16px] font-medium text-[#111]">
            Recently watched
          </h1>
        </div>
        <p className="text-[12px] text-[#999]">
          {videos.length} videos watched
        </p>
      </div>

      <div className="flex-1 bg-[#FAFAFA] px-5 pt-5 pb-20 md:pb-5">
        {videos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-14 h-14 bg-[#EEF2FF] rounded-2xl flex items-center justify-center mb-4">
              <Clock size={24} color="#4F46E5" />
            </div>
            <h2 className="text-[15px] font-medium text-[#111] mb-2">
              No watch history yet
            </h2>
            <p className="text-[13px] text-[#999] max-w-[260px]">
              Videos you watch will appear here sorted by most recent
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {videos.map((video) => (
              <div key={video.id} className="flex flex-col gap-1">
                <VideoCard
                  video={video}
                  chapterCount={video.id ? (chapterCounts[video.id] ?? 0) : 0}
                  collections={collections}
                  onClick={() => navigate(`/watch/${video.youtubeId}`)}
                  onToggleComplete={() => handleToggleComplete(video)}
                  onDelete={() => handleDeleteVideo(video)}
                  onMoveToCollection={(collectionId) =>
                    handleMoveToCollection(video, collectionId)
                  }
                />
                <p className="text-[11px] text-[#999] px-1">
                  {video.lastWatchedAt ? timeAgo(video.lastWatchedAt) : ""}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
