import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCollections, getVideos, getChaptersByVideo } from "../db/helpers";
import type { Collection, Video } from "../types";
import CategoryStrip from "../components/home/CategoryStrip";
import VideoCard from "../components/home/VideoCard";
import ResumeBar from "../components/home/ResumeBar";
import AddVideoModal from "../components/home/AddVideoModal";
import { Bookmark, Plus } from "lucide-react";
export default function Home() {
  const navigate = useNavigate();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [chapterCounts, setChapterCounts] = useState<Record<number, number>>(
    {},
  );
  const [activeFilter, setActiveFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  useEffect(() => {
    getCollections().then(setCollections);
    getVideos().then(async (videos) => {
      setVideos(videos);
      const counts: Record<number, number> = {};
      await Promise.all(
        videos.map(async (v) => {
          if (v.id) {
            const chapters = await getChaptersByVideo(v.id);
            counts[v.id] = chapters.length;
          }
        }),
      );
      setChapterCounts(counts);
    });
  }, []);

  useEffect(() => {
    getCollections().then(setCollections);
    refreshVideos();
  }, []);

  const resumeVideo = videos.find(
    (v) => !v.completed && (v.lastTimestamp ?? 0) > 0,
  );

  const filteredVideos = videos.filter((v) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "in-progress")
      return !v.completed && (v.lastTimestamp ?? 0) > 0;
    if (activeFilter === "completed") return v.completed;
    if (activeFilter.startsWith("collection-")) {
      const id = parseInt(activeFilter.replace("collection-", ""));
      return v.collectionId === id;
    }
    return true;
  });

  const refreshVideos = async () => {
    const vids = await getVideos();
    setVideos(vids);
    const counts: Record<number, number> = {};
    await Promise.all(
      vids.map(async (v) => {
        if (v.id) {
          const chapters = await getChaptersByVideo(v.id);
          counts[v.id] = chapters.length;
        }
      }),
    );
    setChapterCounts(counts);
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="bg-white border-b border-[#EFEFEF] px-5 pt-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-[16px] font-medium text-[#111]">
              Your library
            </h1>
            <p className="text-[12px] text-[#999] mt-[2px]">
              {videos.length} videos ·{" "}
              {Object.values(chapterCounts).reduce((a, b) => a + b, 0)} chapters
              marked
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 text-[12px] font-medium text-white bg-[#4F46E5] rounded-[7px] px-3 py-[7px] hover:bg-[#4338CA]"
          >
            <Plus size={13} />
            Add video
          </button>
        </div>
        <CategoryStrip
          collections={collections}
          active={activeFilter}
          onChange={setActiveFilter}
        />
      </div>

      <div className="flex-1 px-5 pt-5">
        {resumeVideo && activeFilter === "all" && (
          <ResumeBar video={resumeVideo} />
        )}

        {filteredVideos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-14 h-14 bg-[#EEF2FF] rounded-2xl flex items-center justify-center mb-4">
              <Bookmark size={24} color="#4F46E5" />
            </div>
            <h2 className="text-[15px] font-medium text-[#111] mb-2">
              No videos yet
            </h2>
            <p className="text-[13px] text-[#999] mb-5 max-w-[260px]">
              Add a YouTube video to start marking chapters and taking notes
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 text-[12px] font-medium text-white bg-[#4F46E5] rounded-[7px] px-4 py-[8px] hover:bg-[#4338CA]"
            >
              <Plus size={13} />
              Add your first video
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {filteredVideos.map((video) => (
              <VideoCard
                key={video.id}
                video={video}
                chapterCount={video.id ? (chapterCounts[video.id] ?? 0) : 0}
                onClick={() => navigate(`/watch/${video.youtubeId}`)}
              />
            ))}
          </div>
        )}
      </div>
      {showAddModal && (
        <AddVideoModal
          onClose={() => setShowAddModal(false)}
          onAdded={refreshVideos}
        />
      )}
    </div>
  );
}
