import { useState } from "react";
import { X, Link } from "lucide-react";
import { addCollection, addVideo, getCollections } from "../../db/helpers";
import { useEffect } from "react";
import type { Collection } from "../../types";

interface Props {
  onClose: () => void;
  onAdded: () => void;
}

function extractVideoId(input: string): string | null {
  try {
    const url = new URL(input);
    if (url.hostname.includes("youtube.com")) return url.searchParams.get("v");
    if (url.hostname === "youtu.be") return url.pathname.slice(1);
  } catch {
    if (/^[a-zA-Z0-9_-]{11}$/.test(input.trim())) return input.trim();
  }
  return null;
}

async function fetchVideoMeta(
  videoId: string,
): Promise<{ title: string; channelName: string; duration: number }> {
  const res = await fetch(
    `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`,
  );
  if (!res.ok) throw new Error("Video not found");
  const data = await res.json();
  return {
    title: data.title,
    channelName: data.author_name,
    duration: 0,
  };
}

export default function AddVideoModal({ onClose, onAdded }: Props) {
  const [url, setUrl] = useState("");
  const [collections, setCollections] = useState<Collection[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<
    number | undefined
  >();
  const [newCollectionName, setNewCollectionName] = useState("");
  const [isNewCollection, setIsNewCollection] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getCollections().then((cols) => {
      setCollections(cols);
      if (cols[0]?.id) setSelectedCollection(cols[0].id);
    });
  }, []);

  const handleAdd = async () => {
    let collectionId = selectedCollection;
    if (isNewCollection && newCollectionName.trim()) {
      const colors = [
        "#818CF8",
        "#34D399",
        "#FB923C",
        "#F472B6",
        "#60A5FA",
        "#FBBF24",
      ];
      const color = colors[collections.length % colors.length];
      const id = await addCollection(newCollectionName.trim(), color);
      collectionId = id as number;
    }

    setError("");
    const videoId = extractVideoId(url.trim());
    if (!videoId) {
      setError("Please enter a valid YouTube URL or video ID");
      return;
    }
    setLoading(true);
    try {
      const meta = await fetchVideoMeta(videoId);
      await addVideo({
        youtubeId: videoId,
        title: meta.title,
        channelName: meta.channelName,
        duration: meta.duration,
        collectionId,
        lastTimestamp: 0,
        lastWatchedAt: undefined,
        completed: false,
        createdAt: Date.now(),
      });
      onAdded();
      onClose();
    } catch {
      setError("Could not fetch video details. Check the URL and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleAdd();
    if (e.key === "Escape") onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl border border-[#E8E8E8] w-[480px] p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[15px] font-medium text-[#111]">Add a video</h2>
          <button onClick={onClose} className="text-[#CCC] hover:text-[#888]">
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <label className="text-[12px] font-medium text-[#555] mb-[6px] block">
              YouTube URL
            </label>
            <div className="flex items-center gap-2 border border-[#E8E8E8] rounded-[8px] px-3 py-[9px] focus-within:border-[#C7D2FE]">
              <Link size={14} color="#BBB" />
              <input
                autoFocus
                type="text"
                placeholder="https://youtube.com/watch?v=..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 text-[13px] text-[#111] outline-none placeholder:text-[#CCC]"
              />
            </div>
            {error && (
              <p className="text-[11px] text-red-500 mt-[6px]">{error}</p>
            )}
          </div>

          <div>
            <label className="text-[12px] font-medium text-[#555] mb-[6px] block">
              Collection
            </label>
            <select
              value={isNewCollection ? "new" : selectedCollection}
              onChange={(e) => {
                if (e.target.value === "new") {
                  setIsNewCollection(true);
                  setSelectedCollection(undefined);
                } else {
                  setIsNewCollection(false);
                  setSelectedCollection(Number(e.target.value));
                }
              }}
              className="w-full border border-[#E8E8E8] rounded-[8px] px-3 py-[9px] text-[13px] text-[#111] outline-none focus:border-[#C7D2FE]"
            >
              <option value={undefined}>No collection</option>
              {collections.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
              <option value="new">+ New collection</option>
            </select>

            {isNewCollection && (
              <input
                autoFocus
                type="text"
                placeholder="Collection name..."
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
                className="mt-2 w-full border border-[#E8E8E8] rounded-[8px] px-3 py-[9px] text-[13px] text-[#111] outline-none focus:border-[#C7D2FE] placeholder:text-[#CCC]"
              />
            )}
          </div>

          <div className="flex justify-end gap-2 mt-1">
            <button
              onClick={onClose}
              className="text-[12px] text-[#888] bg-white border border-[#E8E8E8] rounded-[7px] px-4 py-[7px] hover:bg-[#F5F5F5]"
            >
              Cancel
            </button>
            <button
              onClick={handleAdd}
              disabled={loading || !url.trim()}
              className="text-[12px] font-medium text-white bg-[#4F46E5] rounded-[7px] px-4 py-[7px] hover:bg-[#4338CA] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? "Adding..." : "Add video"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
