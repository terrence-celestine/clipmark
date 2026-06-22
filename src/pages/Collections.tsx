import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Folder, Plus, Trash2 } from "lucide-react";
import {
  getCollections,
  getVideos,
  getChaptersByVideo,
  deleteCollection,
} from "../db/helpers";
import type { Collection, Video } from "../types";
import AddCollectionModal from "../components/home/AddCollectionModal";
import ConfirmModal from "../components/ui/ConfirmationModal";

interface CollectionWithStats {
  collection: Collection;
  videos: Video[];
  chapterCount: number;
  lastWatchedAt?: number;
}

function timeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export default function Collections() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<CollectionWithStats[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [deletingCollection, setDeletingCollection] =
    useState<Collection | null>(null);

  const load = async () => {
    const [collections, allVideos] = await Promise.all([
      getCollections(),
      getVideos(),
    ]);
    const result: CollectionWithStats[] = await Promise.all(
      collections.map(async (collection) => {
        const videos = allVideos.filter(
          (v) => v.collectionId === collection.id,
        );
        let chapterCount = 0;
        for (const v of videos) {
          if (v.id) {
            const chs = await getChaptersByVideo(v.id);
            chapterCount += chs.length;
          }
        }
        const lastWatchedAt = videos.reduce(
          (max, v) => Math.max(max, v.lastWatchedAt ?? 0),
          0,
        );
        return {
          collection,
          videos,
          chapterCount,
          lastWatchedAt: lastWatchedAt > 0 ? lastWatchedAt : undefined,
        };
      }),
    );
    setStats(result);
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async () => {
    if (!deletingCollection?.id) return;
    await deleteCollection(deletingCollection.id);
    setDeletingCollection(null);
    load();
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="bg-white border-b border-[#EFEFEF] px-5 pt-5 pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-[16px] font-medium text-[#111]">Collections</h1>
          <p className="text-[12px] text-[#999] mt-[2px]">
            {stats.length} collections
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="hidden md:flex items-center gap-2 text-[12px] font-medium text-white bg-[#4F46E5] rounded-[7px] px-3 py-[7px] hover:bg-[#4338CA]"
        >
          <Plus size={13} />
          New collection
        </button>
      </div>

      <div className="flex-1 bg-[#FAFAFA] px-5 pt-5 pb-20 md:pb-5">
        {stats.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-14 h-14 bg-[#EEF2FF] rounded-2xl flex items-center justify-center mb-4">
              <Folder size={24} color="#4F46E5" />
            </div>
            <h2 className="text-[15px] font-medium text-[#111] mb-2">
              No collections yet
            </h2>
            <p className="text-[13px] text-[#999] mb-5 max-w-[260px]">
              Group your videos into collections to keep things organised
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 text-[12px] font-medium text-white bg-[#4F46E5] rounded-[7px] px-4 py-[8px] hover:bg-[#4338CA]"
            >
              <Plus size={13} />
              Create your first collection
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {stats.map(
              ({ collection, videos, chapterCount, lastWatchedAt }) => (
                <div
                  key={collection.id}
                  onClick={() => navigate(`/?collection=${collection.id}`)}
                  className="bg-white border border-[#E8E8E8] rounded-[10px] overflow-hidden cursor-pointer hover:border-[#C7D2FE] transition-colors"
                >
                  <div className="aspect-video bg-[#FAFAFA] border-b border-[#F0F0F0] relative overflow-hidden">
                    {videos[0] ? (
                      <img
                        src={`https://img.youtube.com/vi/${videos[0].youtubeId}/mqdefault.jpg`}
                        alt={videos[0].title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Folder size={24} color="#CCC" />
                      </div>
                    )}
                    <div
                      className="absolute top-3 left-3 w-2 h-2 rounded-full"
                      style={{ background: collection.color }}
                    />
                  </div>

                  <div className="px-4 py-3">
                    <div className="flex items-center gap-2 mb-1">
                      <div
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ background: collection.color }}
                      />
                      <span className="text-[13px] font-medium text-[#111]">
                        {collection.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-[#999]">
                      <span>{videos.length} videos</span>
                      <span>·</span>
                      <span>{chapterCount} chapters</span>
                      {lastWatchedAt && (
                        <>
                          <span>·</span>
                          <span>{timeAgo(lastWatchedAt)}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="px-4 pb-3 flex gap-2 justify-end">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeletingCollection(collection);
                      }}
                      className="text-[#CCC] hover:text-red-500 hover:bg-red-50 p-[5px] rounded transition-colors"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ),
            )}
          </div>
        )}
      </div>

      {showAddModal && (
        <AddCollectionModal
          onClose={() => setShowAddModal(false)}
          onAdded={() => {
            load();
            setShowAddModal(false);
          }}
        />
      )}

      {deletingCollection && (
        <ConfirmModal
          title="Delete collection"
          description={`"${deletingCollection.name}" will be deleted. Videos inside won't be deleted.`}
          onConfirm={handleDelete}
          onCancel={() => setDeletingCollection(null)}
        />
      )}
    </div>
  );
}
