import { useState } from "react";
import { Clock } from "lucide-react";

interface Props {
  timestamp: number;
  initialTitle?: string;
  initialNote?: string;
  onSave: (title: string, note: string) => void;
  onCancel: () => void;
}

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0)
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function NewChapterForm({
  timestamp,
  initialTitle,
  initialNote,
  onSave,
  onCancel,
}: Props) {
  const [title, setTitle] = useState(initialTitle ?? "");
  const [note, setNote] = useState(initialNote ?? "");

  const handleSave = () => {
    if (!title.trim()) return;
    onSave(title.trim(), note.trim());
    setTitle("");
    setNote("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
    if (e.key === "Escape") onCancel();
  };

  return (
    <div className="border-t border-[#EFEFEF] px-3 py-3 bg-[#FAFAFA]">
      <div className="flex items-center gap-2 mb-2">
        <span className="flex items-center gap-1 text-[11px] font-mono font-medium text-[#4338CA] bg-[#EEF2FF] border border-[#C7D2FE] px-2 py-[2px] rounded-full">
          <Clock size={10} />
          {formatTime(timestamp)}
        </span>
        <span className="text-[11px] text-[#999]">New chapter</span>
      </div>

      <div className="flex flex-col gap-[6px]">
        <input
          autoFocus
          type="text"
          placeholder="Chapter title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full bg-white border border-[#E8E8E8] rounded-[7px] text-[12px] text-[#111] px-3 py-[7px] outline-none focus:border-[#C7D2FE] placeholder:text-[#CCC]"
        />
        <input
          type="text"
          placeholder="Add a note (optional)..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full bg-white border border-[#E8E8E8] rounded-[7px] text-[12px] text-[#111] px-3 py-[7px] outline-none focus:border-[#C7D2FE] placeholder:text-[#CCC]"
        />
        <div className="flex justify-end gap-2 mt-1">
          <button
            onClick={onCancel}
            className="text-[11px] text-[#888] bg-white border border-[#E8E8E8] rounded-md px-3 py-[5px] hover:bg-[#F5F5F5] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!title.trim()}
            className="text-[11px] font-medium text-white bg-[#4F46E5] rounded-md px-3 py-[5px] hover:bg-[#4338CA] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Save chapter
          </button>
        </div>
      </div>
    </div>
  );
}
