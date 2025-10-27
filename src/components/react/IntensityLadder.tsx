interface IntensityLadderProps {
  level?: number; // 0–5
}

export default function IntensityLadder({ level = 3 }: IntensityLadderProps) {
  return (
    <div className="flex flex-col items-center gap-2 my-4">
      {Array.from({ length: 5 }).map((_, i) => {
        const active = 5 - i <= level;
        return (
          <div
            key={i}
            className={`w-6 h-6 rounded-sm ${
              active ? "bg-emerald-400" : "bg-indigo-800 opacity-30"
            }`}
          />
        );
      })}
      <span className="text-xs text-slate-400 mt-2">Intensity {level}/5</span>
    </div>
  );
}
