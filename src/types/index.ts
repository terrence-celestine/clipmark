export interface Collection {
  id?: number;
  name: string;
  color: string;
  createdAt: number;
}

export interface Video {
  id?: number;
  youtubeId: string;
  title: string;
  channelName: string;
  duration: number;
  collectionId?: number;
  lastWatchedAt?: number;
  lastTimestamp?: number;
  completed: boolean;
  createdAt: number;
}

export interface Chapter {
  id?: number;
  videoId: number;
  timestamp: number;
  title: string;
  note?: string;
  createdAt: number;
}
