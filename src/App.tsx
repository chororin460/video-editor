import { useState } from "react";
import { open } from "@tauri-apps/plugin-dialog";
import { convertFileSrc } from "@tauri-apps/api/core";
import "./App.css";

function App() {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");

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

    const path = selected;

    setVideoUrl(convertFileSrc(path));
    setFileName(path.split("/").pop() ?? path);
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
            className="video"
            src={videoUrl}
            controls
          />
        ) : (
          <div className="empty">
            動画を開いてください
          </div>
        )}
      </section>

      <footer className="status">
        {fileName || "動画が選択されていません"}
      </footer>
    </main>
  );
}

export default App;