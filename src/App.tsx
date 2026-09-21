import { useRef, useState } from "react";
import { open } from "@tauri-apps/plugin-dialog";
import { convertFileSrc } from "@tauri-apps/api/core";
import "./App.css";

function App() {
  const videoRef = useRef<HTMLVideoElement>(null);

  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  async function openVideo() {
    const selected = await open({
      multiple: false,
      directory: false,
      filters: [
        {
          name: "Video",
          extensions: ["mp4", "mov", "m4v", "webm"],
        },
      ],
    });

    if (!selected) {
      return;
    }

    setVideoUrl(convertFileSrc(selected));
    setFileName(selected.split("/").pop() ?? selected);

    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  }

  async function togglePlayback() {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    if (video.paused) {
      await video.play();
    } else {
      video.pause();
    }
  }

  function formatTime(seconds: number) {
    if (!Number.isFinite(seconds)) {
      return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  }

  return (
    <main className="app">
      <header className="toolbar">
        <h1>Video Editor</h1>

        <button onClick={openVideo}>
          動画を開く
        </button>
      </header>

      <section className="preview">
        {videoUrl ? (
          <video
            ref={videoRef}
            className="video"
            src={videoUrl}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => setIsPlaying(false)}
            onTimeUpdate={(event) => {
              setCurrentTime(event.currentTarget.currentTime);
            }}
            onLoadedMetadata={(event) => {
              setDuration(event.currentTarget.duration);
            }}
          />
        ) : (
          <div className="empty">
            動画を開いてください
          </div>
        )}
      </section>

      <section className="controls">
        <button
          onClick={togglePlayback}
          disabled={!videoUrl}
        >
          {isPlaying ? "⏸ 一時停止" : "▶ 再生"}
        </button>
      
        <input
          className="seek"
          type="range"
          min="0"
          max={duration || 0}
          step="0.01"
          value={currentTime}
          disabled={!videoUrl}
          onChange={(event) => {
            const video = videoRef.current;
      
            if (!video) {
              return;
            }
      
            const newTime = Number(event.currentTarget.value);
      
            video.currentTime = newTime;
            setCurrentTime(newTime);
          }}
        />
      
        <span className="time">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
      </section>

      <footer className="status">
        {fileName || "動画が選択されていません"}
      </footer>
    </main>
  );
}

export default App;