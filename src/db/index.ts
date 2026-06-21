import Dexie, { type EntityTable } from "dexie";
import type { Collection, Video, Chapter } from "../types";

class ClipMarkDB extends Dexie {
  collections!: EntityTable<Collection, "id">;
  videos!: EntityTable<Video, "id">;
  chapters!: EntityTable<Chapter, "id">;

  constructor() {
    super("clipmark");
    this.version(1).stores({
      collections: "++id, name, createdAt",
      videos: "++id, youtubeId, collectionId, createdAt, lastWatchedAt",
      chapters: "++id, videoId, timestamp, createdAt",
    });
  }
}

export const db = new ClipMarkDB();
