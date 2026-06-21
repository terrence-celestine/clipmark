import { db } from "./index";
import type { Video, Chapter } from "../types";

// Collections
export const getCollections = () =>
  db.collections.orderBy("createdAt").toArray();

export const addCollection = (name: string, color: string) =>
  db.collections.add({ name, color, createdAt: Date.now() });

export const deleteCollection = (id: number) => db.collections.delete(id);

// Videos
export const getVideos = () =>
  db.videos.orderBy("createdAt").reverse().toArray();

export const getVideosByCollection = (collectionId: number) =>
  db.videos
    .where("collectionId")
    .equals(collectionId)
    .reverse()
    .sortBy("createdAt");

export const getVideoByYoutubeId = (youtubeId: string) =>
  db.videos.where("youtubeId").equals(youtubeId).first();

export const addVideo = (video: Omit<Video, "id">) => db.videos.add(video);

export const updateVideo = (id: number, changes: Partial<Video>) =>
  db.videos.update(id, changes);

export const deleteVideo = (id: number) => db.videos.delete(id);

// Chapters
export const getChaptersByVideo = (videoId: number) =>
  db.chapters.where("videoId").equals(videoId).sortBy("timestamp");

export const addChapter = (chapter: Omit<Chapter, "id">) =>
  db.chapters.add(chapter);

export const updateChapter = (id: number, changes: Partial<Chapter>) =>
  db.chapters.update(id, changes);

export const deleteChapter = (id: number) => db.chapters.delete(id);
