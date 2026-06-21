import Dexie, { type EntityTable } from "dexie";
import type { Collection, Video, Chapter } from "../types";

class ClipMarkDB extends Dexie {
  collections!: EntityTable<Collection, "id">;
  videos!: EntityTable<Video, "id">;
  chapters!: EntityTable<Chapter, "id">;
  settings!: EntityTable<{ key: string; value: string }, "key">;

  constructor() {
    super("clipmark");
    this.version(2).stores({
      collections: "++id, name, createdAt",
      videos: "++id, youtubeId, collectionId, createdAt, lastWatchedAt",
      chapters: "++id, videoId, timestamp, createdAt",
      settings: "key",
    });
  }
}

export const db = new ClipMarkDB();
