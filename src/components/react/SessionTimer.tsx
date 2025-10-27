import { useState, useEffect } from "react";

export default function SessionTimer() {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, [running]);

  const toggle = () => setRunning((r) => !r);
  const reset = () => setSeconds(0);

  const format = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col items-center gap-2 my-4">
      <div className="text-2xl font-mono text-emerald-400">{format(seconds)}</div>
      <div className="flex gap-2">
        <button
          onClick={toggle}
          className="bg-indigo-700 hover:bg-indigo-600 px-3 py-1 rounded text-white text-sm"
        >
          {running ? "Pause" : "Start"}
        </button>
        <button
          onClick={reset}
          className="bg-slate-700 hover:bg-slate-600 px-3 py-1 rounded text-white text-sm"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
