import { Play, PlayCircle } from "lucide-react";
import type { Video } from "../../types";
import { useNavigate } from "react-router-dom";

interface Props {
  video: Video;
}

function formatTimestamp(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function ResumeBar({ video }: Props) {
  const navigate = useNavigate();

  return (
    <div className="bg-white border border-[#E0E7FF] rounded-[10px] px-3 md:px-4 py-3 flex items-center gap-3 mb-4">
      <div
        className="w-[56px] md:w-[68px] h-9 md:h-10 rounded-md flex items-center justify-center flex-shrink-0"
        style={{ background: "#1e1b4b" }}
      >
        <div className="w-5 h-5 rounded-full border border-white/40 flex items-center justify-center">
          <Play size={8} color="white" fill="white" />
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-medium text-[#6366F1] uppercase tracking-wide mb-[2px]">
          Continue watching
        </p>
        <p className="text-[12px] font-medium text-[#111] truncate">
          {video.title}
        </p>
        <p className="text-[11px] text-[#999] mt-[1px]">
          Stopped at {formatTimestamp(video.lastTimestamp ?? 0)}
        </p>
      </div>

      <button
        onClick={() => navigate(`/watch/${video.youtubeId}`)}
        className="flex items-center gap-[5px] text-[11px] md:text-[12px] font-medium text-[#4F46E5] bg-[#EEF2FF] border border-[#C7D2FE] rounded-[7px] px-2 md:px-3 py-[6px] shrink-0 hover:bg-[#E0E7FF] transition-colors"
      >
        <PlayCircle size={13} />
        <span className="hidden md:inline">Resume</span>
      </button>
    </div>
  );
}
