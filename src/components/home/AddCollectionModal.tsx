import { useState } from "react";
import { X } from "lucide-react";
import { addCollection } from "../../db/helpers";

interface Props {
  onClose: () => void;
  onAdded: () => void;
}

const COLORS = [
  "#818CF8",
  "#34D399",
  "#FB923C",
  "#F472B6",
  "#60A5FA",
  "#FBBF24",
  "#A78BFA",
  "#F87171",
];

export default function AddCollectionModal({ onClose, onAdded }: Props) {
  const [name, setName] = useState("");
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (!name.trim()) {
      setError("Please enter a collection name");
      return;
    }
    setLoading(true);
    try {
      await addCollection(name.trim(), selectedColor);
      onAdded();
      onClose();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSave();
    if (e.key === "Escape") onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl border border-[#E8E8E8] w-[400px] p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[15px] font-medium text-[#111]">
            New collection
          </h2>
          <button onClick={onClose} className="text-[#CCC] hover:text-[#888]">
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <label className="text-[12px] font-medium text-[#555] mb-[6px] block">
              Name
            </label>
            <input
              autoFocus
              type="text"
              placeholder="e.g. React tutorials"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full border border-[#E8E8E8] rounded-[8px] px-3 py-[9px] text-[13px] text-[#111] outline-none focus:border-[#C7D2FE] placeholder:text-[#CCC]"
            />
            {error && (
              <p className="text-[11px] text-red-500 mt-[6px]">{error}</p>
            )}
          </div>

          <div>
            <label className="text-[12px] font-medium text-[#555] mb-[6px] block">
              Color
            </label>
            <div className="flex gap-2 flex-wrap">
              {COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className="w-7 h-7 rounded-full border-2 transition-all"
                  style={{
                    background: color,
                    borderColor:
                      selectedColor === color ? "#111" : "transparent",
                  }}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-1">
            <button
              onClick={onClose}
              className="text-[12px] text-[#888] bg-white border border-[#E8E8E8] rounded-[7px] px-4 py-[7px] hover:bg-[#F5F5F5]"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading || !name.trim()}
              className="text-[12px] font-medium text-white bg-[#4F46E5] rounded-[7px] px-4 py-[7px] hover:bg-[#4338CA] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? "Creating..." : "Create collection"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
