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

export type DrillKey = keyof typeof drillRegistry;