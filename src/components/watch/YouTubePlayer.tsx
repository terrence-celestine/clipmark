import ReactPlayer from "react-player";
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Maximize,
  Bookmark,
} from "lucide-react";
import {
  useState,
  useCallback,
  useImperativeHandle,
  forwardRef,
  useRef,
  useEffect,
} from "react";

import { getSetting, setSetting } from "../../db/helpers";

interface Props {
  videoId: string;
  startAt?: number;
  onTimeUpdate?: (time: number) => void;
  onMarkChapter: (time: number) => void;
  chapterTimestamps: number[];
  duration: number;
  onDurationLoad?: (duration: number) => void;
}

export interface YouTubePlayerHandle {
  seekTo: (seconds: number) => void;
}

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0)
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}

const YouTubePlayer = forwardRef<YouTubePlayerHandle, Props>(
  function YouTubePlayer(
    {
      videoId,
      startAt,
      onTimeUpdate,
      onMarkChapter,
      chapterTimestamps,
      duration,
      onDurationLoad,
    },
    ref,
  ) {
    const playerRef = useRef<HTMLVideoElement>(null);
    const [playing, setPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(startAt ?? 0);
    const [totalDuration, setTotalDuration] = useState(duration);
    const [speed, setSpeed] = useState(1);

    useEffect(() => {
      getSetting("speed").then((value) => {
        if (value) setSpeed(parseFloat(value));
      });
    }, []);

    useImperativeHandle(ref, () => ({
      seekTo: (seconds: number) => {
        if (playerRef.current) {
          seekingRef.current = true;
          playerRef.current.currentTime = seconds;
          setCurrentTime(seconds);
          setTimeout(() => {
            seekingRef.current = false;
          }, 1000);
        }
      },
    }));

    const handleSpeedChange = async () => {
      const speeds = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
      const currentIndex = speeds.indexOf(speed);
      const nextSpeed = speeds[(currentIndex + 1) % speeds.length];
      setSpeed(nextSpeed);
      await setSetting("playbackSpeed", String(nextSpeed));
    };

    const handleScrubberClick = (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const pct = (e.clientX - rect.left) / rect.width;
      const target = Math.floor(pct * totalDuration);
      if (playerRef.current) {
        seekingRef.current = true;
        playerRef.current.currentTime = target;
        setCurrentTime(target);
        setTimeout(() => {
          seekingRef.current = false;
        }, 1000);
      }
    };

    const progressPct =
      totalDuration > 0 ? (currentTime / totalDuration) * 100 : 0;

    const seekingRef = useRef(false);

    const handleProgress = useCallback(
      (e: React.SyntheticEvent<HTMLVideoElement>) => {
        if (seekingRef.current) return;
        const t = Math.floor((e.target as HTMLVideoElement).currentTime);
        setCurrentTime(t);
        onTimeUpdate?.(t);
      },
      [onTimeUpdate],
    );

    return (
      <div className="flex flex-col">
        <div
          className="bg-black w-full"
          style={{ aspectRatio: "16/9", maxHeight: "calc(100vh - 200px)" }}
        >
          <ReactPlayer
            ref={playerRef}
            src={`https://www.youtube.com/watch?v=${videoId}`}
            playing={playing}
            onTimeUpdate={handleProgress}
            onDurationChange={(e) => {
              const d = Math.floor((e.target as HTMLVideoElement).duration);
              setTotalDuration(d);
              onDurationLoad?.(d);
            }}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            width="100%"
            height="100%"
            controls={false}
            playbackRate={speed}
          />
        </div>

        <div className="bg-white border-t border-[#EFEFEF] px-4 py-3 flex flex-col gap-2">
          <div
            className="relative h-[3px] bg-[#EBEBEB] rounded-full cursor-pointer"
            onClick={handleScrubberClick}
          >
            <div
              className="absolute left-0 top-0 h-full bg-[#4F46E5] rounded-full"
              style={{ width: `${progressPct}%` }}
            />
            {chapterTimestamps.map((ts, i) => (
              <div
                key={i}
                className="absolute top-[-3px] w-[3px] h-[9px] bg-[#818CF8] rounded-sm -translate-x-1/2"
                style={{ left: `${(ts / totalDuration) * 100}%` }}
              />
            ))}
            <div
              className="absolute top-[-4px] w-3 h-3 bg-[#4F46E5] border-2 border-white rounded-full -translate-x-1/2 shadow-sm"
              style={{ left: `${progressPct}%` }}
            />
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <button
              onClick={() => {
                if (playerRef.current) {
                  seekingRef.current = true;
                  const t = currentTime - 10;
                  playerRef.current.currentTime = t;
                  setCurrentTime(t);
                  setTimeout(() => {
                    seekingRef.current = false;
                  }, 1000);
                }
              }}
              className="text-[#555] hover:text-[#111]"
            >
              <RotateCcw size={15} />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setPlaying((p) => !p);
              }}
              className="text-[#111]"
            >
              {playing ? <Pause size={18} /> : <Play size={18} fill="#111" />}
            </button>

            <button
              onClick={() => {
                if (playerRef.current) {
                  seekingRef.current = true;
                  const t = currentTime + 10;
                  playerRef.current.currentTime = t;
                  setCurrentTime(t);
                  setTimeout(() => {
                    seekingRef.current = false;
                  }, 1000);
                }
              }}
              className="text-[#555] hover:text-[#111]"
            >
              <RotateCw size={15} />
            </button>

            <span className="text-[11px] font-mono text-[#999]">
              {formatTime(currentTime)} / {formatTime(totalDuration)}
            </span>

            <div className="flex-1" />

            <button
              onClick={handleSpeedChange}
              className="text-[11px] font-mono text-[#666] bg-[#F5F5F5] border border-[#E8E8E8] px-[5px] py-[1px] rounded hover:bg-[#EBEBEB] transition-colors"
            >
              {speed}×
            </button>

            <button className="text-[#888] hover:text-[#111] hidden md:flex">
              <Maximize size={14} />
            </button>

            <button
              onClick={() => onMarkChapter(currentTime)}
              className="flex items-center gap-[4px] text-[11px] md:text-[12px] font-medium text-[#4F46E5] bg-[#EEF2FF] border border-[#C7D2FE] rounded-[7px] px-2 md:px-3 py-[5px] hover:bg-[#E0E7FF] transition-colors"
            >
              <Bookmark size={12} />
              <span className="hidden md:inline">Mark chapter</span>
              <span className="hidden md:inline text-[10px] bg-[#C7D2FE] text-[#3730A3] px-[5px] py-px rounded font-mono">
                T
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  },
);

export default YouTubePlayer;
