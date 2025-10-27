import { useEffect, useState } from "react";

interface BeatTableProps {
  bpm?: number;
  count?: number;
}

export default function BeatTable({ bpm = 90, count = 8 }: BeatTableProps) {
  const [beat, setBeat] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setBeat((b) => (b + 1) % count);
    }, 60000 / bpm);
    return () => clearInterval(interval);
  }, [bpm, count]);

  return (
    <div className="flex justify-center gap-2 my-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`w-4 h-4 rounded-full transition-all duration-150 ${
            i === beat ? "bg-emerald-400 scale-125" : "bg-indigo-700 opacity-50"
          }`}
        />
      ))}
    </div>
  );
}
