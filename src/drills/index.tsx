// src/drills/index.tsx
import CardValueTrainer from "./CardValueTrainer";
import CardShuffleTrainer from "./CardShuffleTrainer";
import DealerRhythmTrainer from "./DealerRhythmTrainer";
import DealerPatterTrainer from "./DealerPatterTrainer";
import DealerRehearsal from "./DealerRehearsal";

export const drillRegistry = {
  "card-value-trainer": CardValueTrainer,
  "card-shuffle-trainer": CardShuffleTrainer,
  "dealer-rhythm-trainer": DealerRhythmTrainer,
  "dealer-patter-trainer": DealerPatterTrainer,
  "dealer-rehearsal": DealerRehearsal,
};

// Optional: local drill selector for /blackjack/drills/index.astro
import React, { useState } from "react";

export default function DrillIndex() {
  const [active, setActive] = useState<string | null>(null);

  const drills = Object.entries(drillRegistry).map(([key, Component]) => ({
    key,
    name:
      key
        .replace(/-/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase()) || "Unnamed Drill",
    Component,
  }));

  return (
    <div className="drill-index">
      <h1 className="text-xl font-bold mb-4">🎴 Dealer Drill Suite</h1>

      {!active && (
        <ul className="space-y-2">
          {drills.map(({ key, name }) => (
            <li key={key}>
              <button
                className="px-3 py-2 border rounded hover:bg-gray-100"
                onClick={() => setActive(key)}
              >
                {name}
              </button>
            </li>
          ))}
        </ul>
      )}

      {active && (
        <div className="mt-4">
          <button
            className="mb-2 text-sm text-blue-600 underline"
            onClick={() => setActive(null)}
          >
            ← Back to drills
          </button>
          {React.createElement(drillRegistry[active])}
        </div>
      )}
    </div>
  );
}
