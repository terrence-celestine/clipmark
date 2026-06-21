import { useYouTubePlayer } from "../../hooks/useYoutubePlayer";
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Maximize,
  Volume2,
} from "lucide-react";
import { useState, useCallback } from "react";

interface Props {
  videoId: string;
  startAt?: number;
  onTimeUpdate?: (time: number) => void;
  onMarkChapter: (time: number) => void;
  chapterTimestamps: number[];
  duration: number;
}

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0)
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function YouTubePlayer({
  videoId,
  onTimeUpdate,
  onMarkChapter,
  chapterTimestamps,
  duration,
}: Props) {
  const [currentTime, setCurrentTime] = useState(0);

  const handleTimeUpdate = useCallback(
    (time: number) => {
      setCurrentTime(time);
      onTimeUpdate?.(time);
    },
    [onTimeUpdate],
  );

  const {
    containerRef,
    playing,
    play,
    pause,
    seekTo,
    getCurrentTime,
    getDuration,
  } = useYouTubePlayer({
    videoId,
    onTimeUpdate: handleTimeUpdate,
  });

  const totalDuration = getDuration() || duration;

  const handleScrubberClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    const target = Math.floor(pct * totalDuration);
    seekTo(target);
  };

  const progressPct =
    totalDuration > 0 ? (currentTime / totalDuration) * 100 : 0;

  return (
    <div className="flex flex-col">
      <div className="bg-black flex items-center justify-center">
        <div
          ref={containerRef}
          className="aspect-video w-full max-h-[calc(100vh-180px)]"
        />
      </div>

      <div className="bg-white border-t border-[#EFEFEF] px-4 py-3 flex flex-col gap-2">
        <div
          className="relative h-[3px] bg-[#EBEBEB] rounded-full cursor-pointer"
          onClick={handleScrubberClick}
        >
          <div
            className="absolute left-0 top-0 h-full bg-[#4F46E5] rounded-full"
            style={{ width: `${progressPct}%` }}
          />
          {chapterTimestamps.map((ts, i) => (
            <div
              key={i}
              className="absolute top-[-3px] w-[3px] h-[9px] bg-[#818CF8] rounded-sm -translate-x-1/2"
              style={{ left: `${(ts / totalDuration) * 100}%` }}
            />
          ))}
          <div
            className="absolute top-[-4px] w-3 h-3 bg-[#4F46E5] border-2 border-white rounded-full -translate-x-1/2 shadow-sm"
            style={{ left: `${progressPct}%` }}
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => seekTo(getCurrentTime() - 10)}
            className="text-[#555] hover:text-[#111]"
          >
            <RotateCcw size={16} />
          </button>
          <button onClick={playing ? pause : play} className="text-[#111]">
            {playing ? <Pause size={20} /> : <Play size={20} fill="#111" />}
          </button>
          <button
            onClick={() => seekTo(getCurrentTime() + 10)}
            className="text-[#555] hover:text-[#111]"
          >
            <RotateCw size={16} />
          </button>
          <span className="text-[11px] font-mono text-[#999]">
            {formatTime(currentTime)} / {formatTime(totalDuration)}
          </span>
          <div className="flex-1" />
          <Volume2 size={14} color="#888" />
          <span className="text-[11px] font-mono text-[#666] bg-[#F5F5F5] border border-[#E8E8E8] px-[6px] py-[2px] rounded">
            1×
          </span>
          <button className="text-[#888] hover:text-[#111]">
            <Maximize size={14} />
          </button>
          <button
            onClick={() => onMarkChapter(Math.floor(getCurrentTime()))}
            className="flex items-center gap-[5px] text-[12px] font-medium text-[#4F46E5] bg-[#EEF2FF] border border-[#C7D2FE] rounded-[7px] px-3 py-[5px] hover:bg-[#E0E7FF] transition-colors"
          >
            Mark chapter
            <span className="text-[10px] bg-[#C7D2FE] text-[#3730A3] px-[5px] py-[1px] rounded font-mono">
              T
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
