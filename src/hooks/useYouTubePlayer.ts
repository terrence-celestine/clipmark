/// <reference types="youtube" />
import { useEffect, useRef, useState } from "react";

interface UseYouTubePlayerOptions {
  videoId: string;
  onTimeUpdate?: (time: number) => void;
}

export function useYouTubePlayer({
  videoId,
  onTimeUpdate,
}: UseYouTubePlayerOptions) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YT.Player | null>(null);
  const intervalRef = useRef<number | null>(null);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const initPlayer = () => {
      if (!containerRef.current) return;
      playerRef.current = new YT.Player(containerRef.current, {
        videoId,
        playerVars: {
          controls: 0,
          rel: 0,
          modestbranding: 1,
        },
        events: {
          onReady: () => setReady(true),
          onStateChange: (e) => {
            setPlaying(e.data === YT.PlayerState.PLAYING);
          },
        },
      });
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      window.onYouTubeIframeAPIReady = initPlayer;
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      playerRef.current?.destroy();
    };
  }, [videoId]);

  useEffect(() => {
    if (!ready || !onTimeUpdate) return;
    intervalRef.current = window.setInterval(() => {
      const time = playerRef.current?.getCurrentTime() ?? 0;
      onTimeUpdate(Math.floor(time));
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [ready, onTimeUpdate]);

  const play = () => playerRef.current?.playVideo();
  const pause = () => playerRef.current?.pauseVideo();
  const seekTo = (seconds: number) => playerRef.current?.seekTo(seconds, true);
  const getCurrentTime = () => playerRef.current?.getCurrentTime() ?? 0;
  const getDuration = () => playerRef.current?.getDuration() ?? 0;

  return {
    containerRef,
    ready,
    playing,
    play,
    pause,
    seekTo,
    getCurrentTime,
    getDuration,
  };
}
