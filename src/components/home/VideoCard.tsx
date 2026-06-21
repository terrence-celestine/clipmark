import {
  Bookmark,
  CheckCircle,
  ChevronRight,
  Circle,
  Folder,
  MoreHorizontal,
  Play,
  Trash2,
} from "lucide-react";
import type { Collection, Video } from "../../types";
import { useState } from "react";
import ConfirmModal from "../ui/ConfirmationModal";

interface Props {
  video: Video;
  chapterCount: number;
  collections: Collection[];
  onMoveToCollection: (collectionId: number | undefined) => void;
  onClick: () => void;
  onToggleComplete: () => void;
  onDelete: () => void;
}

const THUMB_COLORS: Record<number, string> = {
  0: "#1e1b4b",
  1: "#052e16",
  2: "#27272a",
  3: "#0c1a3a",
  4: "#2d1b4e",
  5: "#1a1207",
};

export default function VideoCard({
  video,
  chapterCount,
  onClick,
  onToggleComplete,
  collections,
  onMoveToCollection,
  onDelete,
}: Props) {
  const colorIndex = video.id ? video.id % 6 : 0;
  const bgColor = THUMB_COLORS[colorIndex];
  const [menuOpen, setMenuOpen] = useState(false);
  const [showCollections, setShowCollections] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  return (
    <div
      onClick={onClick}
      className="bg-white border border-[#EBEBEB] rounded-[10px] overflow-hidden cursor-pointer hover:border-[#C7D2FE] transition-colors"
    >
      <div
        className="aspect-video relative flex items-center justify-center overflow-hidden"
        style={{ background: bgColor }}
      >
        <img
          src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
          alt={video.title}
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
        <div className="w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center relative z-10">
          <Play size={14} color="white" fill="white" />
        </div>
        {video.duration && (
          <span className="absolute bottom-2 right-2 z-10 text-[11px] font-mono text-white bg-black/55 px-[6px] py-[2px] rounded">
            {video.duration ? formatDuration(video.duration) : null}
          </span>
        )}
        {video.completed && (
          <span className="absolute top-2 left-2 z-10 text-[10px] font-medium text-[#166534] bg-[#DCFCE7] border border-[#86EFAC] px-2 py-[2px] rounded-full">
            Done
          </span>
        )}
      </div>

      <div className="px-3 pt-[10px] pb-3">
        <p className="text-[13px] font-medium text-[#111] leading-[1.45] line-clamp-2 mb-[6px]">
          {video.title}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-[#888]">{video.channelName}</span>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-[11px] text-[#4338CA] bg-[#EEF2FF] px-2 py-[2px] rounded-full">
              <Bookmark size={10} />
              {chapterCount}
            </span>
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen((m) => !m);
                }}
                className="text-[#CCC] hover:text-[#888] hover:bg-[#F5F5F5] rounded p-[2px] transition-colors"
              >
                <MoreHorizontal size={14} />
              </button>

              {menuOpen && (
                <div
                  className="absolute right-0 bottom-7 bg-white border border-[#E8E8E8] rounded-[8px] shadow-sm py-1 w-[160px] z-10"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => {
                      setShowConfirmationModal(true);
                      setMenuOpen(false);
                    }}
                    className="w-full text-left text-[12px] text-red-500 px-3 py-[7px] hover:bg-red-50 flex items-center gap-2"
                  >
                    <Trash2 size={13} />
                    Delete video
                  </button>
                  <button
                    onClick={() => {
                      onToggleComplete();
                      setMenuOpen(false);
                    }}
                    className="w-full text-left text-[12px] text-[#444] px-3 py-[7px] hover:bg-[#F5F5F5] flex items-center gap-2"
                  >
                    {video.completed ? (
                      <>
                        <Circle size={13} /> Mark as unwatched
                      </>
                    ) : (
                      <>
                        <CheckCircle size={13} color="#22C55E" /> Mark as
                        completed
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setShowCollections((s) => !s)}
                    className="w-full text-left text-[12px] text-[#444] px-3 py-[7px] hover:bg-[#F5F5F5] flex items-center justify-between gap-2"
                  >
                    <span className="flex items-center gap-2">
                      <Folder size={13} />
                      Add to collection
                    </span>
                    <ChevronRight size={12} color="#CCC" />
                  </button>

                  {showCollections && (
                    <div className="border-t border-[#F0F0F0] mt-1 pt-1">
                      <button
                        onClick={() => {
                          onMoveToCollection(undefined);
                          setMenuOpen(false);
                          setShowCollections(false);
                        }}
                        className="w-full text-left text-[12px] text-[#888] px-3 py-[6px] hover:bg-[#F5F5F5]"
                      >
                        No collection
                      </button>
                      {collections.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => {
                            onMoveToCollection(c.id);
                            setMenuOpen(false);
                            setShowCollections(false);
                          }}
                          className="w-full text-left text-[12px] text-[#444] px-3 py-[6px] hover:bg-[#F5F5F5] flex items-center gap-2"
                        >
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{ background: c.color }}
                          />
                          {c.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {showConfirmationModal && (
        <ConfirmModal
          title="Delete video"
          description={`"${video.title}" and all its chapters will be permanently deleted.`}
          onConfirm={() => {
            onDelete();
            setShowConfirmationModal(false);
          }}
          onCancel={() => setShowConfirmationModal(false)}
        />
      )}
    </div>
  );
}

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0)
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}
