import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { ChevronRight, ExternalLink, MoreHorizontal } from "lucide-react";
import { db } from "../db";
import type { Video, Chapter } from "../types";
import {
  getChaptersByVideo,
  updateVideo,
  addChapter,
  deleteChapter,
  updateChapter,
} from "../db/helpers";
import YouTubePlayer, {
  type YouTubePlayerHandle,
} from "../components/watch/YouTubePlayer";
import ChapterSidebar from "../components/watch/ChapterSidebar";
import NewChapterForm from "../components/watch/NewChapterForm";

export default function Watch() {
  const { videoId } = useParams<{ videoId: string }>();
  const navigate = useNavigate();
  const [video, setVideo] = useState<Video | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [pendingTimestamp, setPendingTimestamp] = useState<number | null>(null);
  const [editingChapter, setEditingChapter] = useState<Chapter | null>(null);

  const playerRef = useRef<YouTubePlayerHandle>(null);
  const seekTo = useCallback((seconds: number) => {
    console.log("Watch seekTo", seconds);
    playerRef.current?.seekTo(seconds);
  }, []);

  useEffect(() => {
    console.log("video changed", video?.id);
  }, [video]);

  useEffect(() => {
    console.log("chapters changed", chapters.length);
  }, [chapters]);

  useEffect(() => {
    if (!videoId) return;
    db.videos
      .where("youtubeId")
      .equals(videoId)
      .first()
      .then((v) => {
        if (v) setVideo(v);
        else navigate("/");
      });
  }, [videoId, navigate]);

  useEffect(() => {
    if (!video?.id) return;
    refreshChapters();
  }, [video]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "T" || e.key === "t") {
        e.preventDefault();
        setPendingTimestamp(currentTime);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentTime]);

  const refreshChapters = async () => {
    if (!video?.id) return;
    const chs = await getChaptersByVideo(video.id);
    setChapters(chs);
  };

  const handleTimeUpdate = useCallback(
    (time: number) => {
      setCurrentTime(time);
      if (!video?.id) return;
      updateVideo(video.id, { lastTimestamp: time, lastWatchedAt: Date.now() });
    },
    [video],
  );

  const handleMarkChapter = useCallback((time: number) => {
    setPendingTimestamp(time);
  }, []);

  const handleSaveChapter = async (title: string, note: string) => {
    if (!video?.id || pendingTimestamp === null) return;
    await addChapter({
      videoId: video.id,
      timestamp: pendingTimestamp,
      title,
      note,
      createdAt: Date.now(),
    });
    setPendingTimestamp(null);
    refreshChapters();
  };

  const handleDeleteChapter = async (id: number) => {
    await deleteChapter(id);
    refreshChapters();
  };

  const handleEditChapter = useCallback(
    async (chapter: Chapter, title: string, note: string) => {
      if (!chapter.id) return;
      await updateChapter(chapter.id, { title, note });
      setEditingChapter(null);
      refreshChapters();
    },
    [],
  );

  const chapterTimestamps = useMemo(
    () => chapters.map((c) => c.timestamp),
    [chapters],
  );

  if (!video) return <div className="p-8 text-[#999]">Loading...</div>;

  return (
    <div className="flex flex-col flex-1 overflow-hidden h-[calc(100vh-52px)]">
      <div className="h-[44px] flex items-center px-5 gap-2 bg-white border-b border-[#EFEFEF] shrink-0">
        <Link to="/" className="text-[12px] text-[#6366F1] hover:underline">
          Library
        </Link>
        <ChevronRight size={13} color="#CCC" />
        <span className="text-[12px] text-[#111] font-medium truncate flex-1">
          {video.title}
        </span>
        <a
          href={`https://youtube.com/watch?v=${video.youtubeId}`}
          target="_blank"
          rel="noreferrer"
          className="text-[#888] hover:text-[#555]"
        >
          <ExternalLink size={14} />
        </a>
        <button className="text-[#888] hover:text-[#555]">
          <MoreHorizontal size={16} />
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          <YouTubePlayer
            videoId={video.youtubeId}
            duration={video.duration}
            startAt={video.lastTimestamp}
            chapterTimestamps={chapterTimestamps}
            onTimeUpdate={handleTimeUpdate}
            onMarkChapter={handleMarkChapter}
            ref={playerRef}
          />
          <div className="px-5 py-3 bg-white border-t border-[#EFEFEF]">
            <p className="text-[13px] font-medium text-[#111]">{video.title}</p>
            <p className="text-[11px] text-[#888] mt-1">{video.channelName}</p>
          </div>
        </div>

        <div className="w-[272px] bg-white border-l border-[#EFEFEF] flex flex-col overflow-hidden">
          <div className="flex-1 overflow-hidden flex flex-col">
            <ChapterSidebar
              chapters={chapters}
              currentTime={currentTime}
              duration={video.duration}
              onSeek={(timestamp) => seekTo(timestamp)}
              onDelete={handleDeleteChapter}
              onEdit={(chapter) => setEditingChapter(chapter)}
            />
          </div>
          {editingChapter && (
            <NewChapterForm
              timestamp={editingChapter.timestamp}
              initialTitle={editingChapter.title}
              initialNote={editingChapter.note ?? ""}
              onSave={(title, note) =>
                handleEditChapter(editingChapter, title, note)
              }
              onCancel={() => setEditingChapter(null)}
            />
          )}
          {pendingTimestamp !== null && (
            <NewChapterForm
              timestamp={pendingTimestamp}
              onSave={handleSaveChapter}
              onCancel={() => setPendingTimestamp(null)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
