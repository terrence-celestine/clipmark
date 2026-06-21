import { db } from "./index";

export const seedDatabase = async () => {
  const existingVideos = await db.videos.count();
  if (existingVideos > 0) return;

  const collectionIds = await db.collections.bulkAdd(
    [
      { name: "React tutorials", color: "#818CF8", createdAt: Date.now() },
      { name: "Interview prep", color: "#34D399", createdAt: Date.now() },
      { name: "System design", color: "#FB923C", createdAt: Date.now() },
    ],
    { allKeys: true },
  );

  const videoIds = await db.videos.bulkAdd(
    [
      {
        youtubeId: "novnyCaa7To",
        title: "React Query v5 — Full Deep Dive (2024)",
        channelName: "Theo — t3.gg",
        duration: 2897,
        collectionId: collectionIds[0] as number,
        lastTimestamp: 1122,
        lastWatchedAt: Date.now(),
        completed: false,
        createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
      },
      {
        youtubeId: "UF9__kovY6Q",
        title: "System Design Interview — Designing Twitter",
        channelName: "Exponent",
        duration: 4324,
        collectionId: collectionIds[2] as number,
        lastTimestamp: 4324,
        lastWatchedAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
        completed: true,
        createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
      },
      {
        youtubeId: "TNhaISOUy6Q",
        title: "React hooks deep dive — useEffect, useMemo, useCallback",
        channelName: "Jack Herrington",
        duration: 1970,
        collectionId: collectionIds[0] as number,
        lastTimestamp: 0,
        lastWatchedAt: undefined,
        completed: false,
        createdAt: Date.now() - 7 * 24 * 60 * 60 * 1000,
      },
    ],
    { allKeys: true },
  );

  await db.chapters.bulkAdd([
    {
      videoId: videoIds[0] as number,
      timestamp: 312,
      title: "Query key factory pattern",
      note: "Good pattern for organising keys across features",
      createdAt: Date.now(),
    },
    {
      videoId: videoIds[0] as number,
      timestamp: 1122,
      title: "Optimistic updates explained",
      note: "useMutation + onMutate — rollback on error",
      createdAt: Date.now(),
    },
    {
      videoId: videoIds[0] as number,
      timestamp: 1795,
      title: "Prefetching strategies",
      note: "",
      createdAt: Date.now(),
    },
    {
      videoId: videoIds[1] as number,
      timestamp: 344,
      title: "Requirements clarification",
      note: "",
      createdAt: Date.now(),
    },
    {
      videoId: videoIds[1] as number,
      timestamp: 961,
      title: "High level design",
      note: "Start with feed service + fanout",
      createdAt: Date.now(),
    },
    {
      videoId: videoIds[1] as number,
      timestamp: 1938,
      title: "Database schema",
      note: "",
      createdAt: Date.now(),
    },
    {
      videoId: videoIds[2] as number,
      timestamp: 275,
      title: "useEffect cleanup",
      note: "",
      createdAt: Date.now(),
    },
    {
      videoId: videoIds[2] as number,
      timestamp: 746,
      title: "Stale closure problem",
      note: "The classic trap with setInterval",
      createdAt: Date.now(),
    },
    {
        
    }
  ]);
};
