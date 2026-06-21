import { Check, Play, Edit2, Trash2 } from "lucide-react";
import type { Chapter } from "../../types";

interface Props {
  chapters: Chapter[];
  currentTime: number;
  duration: number;
  onSeek: (timestamp: number) => void;
  onDelete: (id: number) => void;
  onEdit: (chapter: Chapter) => void;
}

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0)
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function getSegmentDuration(
  chapters: Chapter[],
  index: number,
  videoDuration: number,
): string {
  const next = chapters[index + 1]?.timestamp ?? videoDuration;
  const duration = next - chapters[index].timestamp;
  const m = Math.floor(duration / 60);
  return `${m} min segment`;
}

export default function ChapterSidebar({
  chapters,
  currentTime,
  duration,
  onSeek,
  onDelete,
  onEdit,
}: Props) {
  const activeIndex = chapters.reduce((acc, ch, i) => {
    return currentTime >= ch.timestamp ? i : acc;
  }, -1);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-[#EFEFEF]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[13px] font-medium text-[#111]">Chapters</span>
          <span className="text-[11px] text-[#999]">
            {chapters.length} saved
          </span>
        </div>
        <div className="h-[2px] bg-[#F0F0F0] rounded-full">
          <div
            className="h-full bg-[#4F46E5] rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-[10px] text-[#BBB]">
            {formatTime(currentTime)}
          </span>
          <span className="text-[10px] text-[#BBB]">
            {formatTime(duration)}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1">
        {chapters.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center px-6">
            <p className="text-[13px] font-medium text-[#111] mb-1">
              No chapters yet
            </p>
            <p className="text-[12px] text-[#999]">
              Press{" "}
              <kbd className="bg-[#F0F0F0] px-1 rounded text-[11px]">T</kbd>{" "}
              while watching to mark a chapter
            </p>
          </div>
        )}

        {chapters.map((chapter, i) => {
          const isWatched = activeIndex > i;
          const isActive = activeIndex === i;

          return (
            <div
              key={chapter.id}
              onClick={(e) => {
                e.preventDefault();
                onSeek(chapter.timestamp);
              }}
              className={`group flex gap-3 px-3 py-2 rounded-lg cursor-pointer border transition-colors ${
                isActive
                  ? "bg-[#EEF2FF] border-[#C7D2FE]"
                  : "border-transparent hover:bg-[#FAFAFA] hover:border-[#EFEFEF]"
              }`}
            >
              <div className="flex flex-col items-center gap-1 pt-[2px]">
                <div
                  className={`w-[18px] h-[18px] rounded-full border flex items-center justify-center flex-shrink-0 text-[9px] font-medium ${
                    isWatched
                      ? "bg-[#4F46E5] border-[#4F46E5] text-white"
                      : isActive
                        ? "bg-[#EEF2FF] border-[#6366F1] text-[#4F46E5]"
                        : "border-[#DDD] text-[#AAA]"
                  }`}
                >
                  {isWatched ? (
                    <Check size={9} />
                  ) : isActive ? (
                    <Play size={7} fill="#4F46E5" />
                  ) : (
                    i + 1
                  )}
                </div>
                {i < chapters.length - 1 && (
                  <div className="w-[1px] bg-[#EFEFEF] flex-1 min-h-[12px]" />
                )}
              </div>

              <div className="flex-1 min-w-0 pb-1">
                <p className="text-[11px] font-mono text-[#6366F1] font-medium mb-[2px]">
                  {formatTime(chapter.timestamp)}
                </p>
                <p
                  className={`text-[12px] font-medium leading-[1.4] ${isWatched ? "text-[#AAA]" : "text-[#111]"}`}
                >
                  {chapter.title}
                </p>
                {chapter.note && (
                  <p className="text-[11px] text-[#999] mt-[3px] leading-[1.4] line-clamp-2">
                    {chapter.note}
                  </p>
                )}
                <p className="text-[10px] text-[#CCC] mt-[2px] font-mono">
                  {getSegmentDuration(chapters, i, duration)}
                </p>
              </div>

              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity pt-[2px]">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(chapter);
                  }}
                  className="text-[#CCC] hover:text-[#888] hover:bg-[#F0F0F0] p-[3px] rounded"
                >
                  <Edit2 size={12} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    chapter.id && onDelete(chapter.id);
                  }}
                  className="text-[#CCC] hover:text-[#888] hover:bg-[#F0F0F0] p-[3px] rounded"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
