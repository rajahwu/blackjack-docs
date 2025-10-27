import { useState } from "react";

export default function DrillLog() {
  const [entries, setEntries] = useState<string[]>([]);
  const [text, setText] = useState("");

  const addEntry = () => {
    if (!text.trim()) return;
    setEntries((e) => [...e, text.trim()]);
    setText("");
  };

  return (
    <div className="flex flex-col items-start gap-3 my-4 w-full max-w-md">
      <div className="flex gap-2 w-full">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add drill note..."
          className="flex-grow px-3 py-1 rounded bg-slate-800 text-white border border-slate-700"
        />
        <button
          onClick={addEntry}
          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 rounded text-sm text-white"
        >
          Add
        </button>
      </div>
      <ul className="text-slate-300 text-sm list-disc pl-5 w-full">
        {entries.map((entry, i) => (
          <li key={i}>{entry}</li>
        ))}
      </ul>
    </div>
  );
}
