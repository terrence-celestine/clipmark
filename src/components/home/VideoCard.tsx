import { Bookmark, MoreHorizontal, Play } from "lucide-react";
import type { Video } from "../../types";

interface Props {
  video: Video;
  chapterCount: number;
  onClick: () => void;
}

const THUMB_COLORS: Record<number, string> = {
  0: "#1e1b4b",
  1: "#052e16",
  2: "#27272a",
  3: "#0c1a3a",
  4: "#2d1b4e",
  5: "#1a1207",
};

export default function VideoCard({ video, chapterCount, onClick }: Props) {
  const colorIndex = video.id ? video.id % 6 : 0;
  const bgColor = THUMB_COLORS[colorIndex];

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
        <span className="absolute bottom-2 right-2 z-10 text-[11px] font-mono text-white bg-black/55 px-[6px] py-[2px] rounded">
          {formatDuration(video.duration)}
        </span>
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
            <button
              onClick={(e) => e.stopPropagation()}
              className="text-[#CCC] hover:text-[#888] hover:bg-[#F5F5F5] rounded p-[2px] transition-colors"
            >
              <MoreHorizontal size={14} />
            </button>
          </div>
        </div>
      </div>
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
