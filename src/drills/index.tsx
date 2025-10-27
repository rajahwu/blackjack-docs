import React, { useState } from "react";

import CardValueTrainer from "./CardValueTrainer";
import CardShuffleTrainer from "./CardShuffleTrainer";
import DealerRhythmTrainer from "./DealerRhythmTrainer";
import DealerPatterTrainer from "./DealerPatterTrainer";
import DealerRehearsal from "./DealerRehearsal";

type DrillKey =
  | "cardValue"
  | "cardShuffle"
  | "dealerRhythm"
  | "dealerPatter"
  | "dealerRehearsal";

const drillRegistry: Record<
  DrillKey,
  { name: string; component: React.ReactNode }
> = {
  cardValue: { name: "Card Value Trainer", component: <CardValueTrainer /> },
  cardShuffle: { name: "Card Shuffle Trainer", component: <CardShuffleTrainer /> },
  dealerRhythm: { name: "Dealer Rhythm Trainer", component: <DealerRhythmTrainer /> },
  dealerPatter: { name: "Dealer Patter Trainer", component: <DealerPatterTrainer /> },
  dealerRehearsal: { name: "Dealer Rehearsal", component: <DealerRehearsal /> },
};

export default function DrillIndex() {
  const [active, setActive] = useState<DrillKey | null>(null);

  return (
    <div className="drill-index">
      <h1 className="text-xl font-bold mb-4">🎴 Dealer Drill Suite</h1>

      {!active && (
        <ul className="space-y-2">
          {Object.entries(drillRegistry).map(([key, drill]) => (
            <li key={key}>
              <button
                className="px-3 py-2 border rounded hover:bg-gray-100"
                onClick={() => setActive(key as DrillKey)}
              >
                {drill.name}
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
          {drillRegistry[active].component}
        </div>
      )}
    </div>
  );
}
