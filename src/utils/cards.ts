// --- Types ---
export type Suit = "spades" | "hearts" | "clubs" | "diamonds";
export type CardValue = "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "T" | "J" | "Q" | "K" | "A";

export interface Card {
  value: CardValue;
  suit: Suit;
  color: "red" | "black";
}

// --- Constants ---
export const CARDS: CardValue[] = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];

export const VALUES: Record<CardValue, number> = {
  "2": 2, "3": 3, "4": 4, "5": 5, "6": 6, "7": 7, "8": 8, "9": 9,
  "T": 10, "J": 10, "Q": 10, "K": 10, "A": 11
};

export const SUITS: Record<Suit, "red" | "black"> = {
  spades: "black",
  clubs: "black",
  hearts: "red",
  diamonds: "red"
};

const suitKeys = Object.keys(SUITS) as Suit[];

// --- Utility Functions ---

// Generate a single random card
export function getRandomCard(): Card {
  const value = CARDS[Math.floor(Math.random() * CARDS.length)];
  const suit = suitKeys[Math.floor(Math.random() * suitKeys.length)];
  return { value, suit, color: SUITS[suit] };
}

// Generate a hand of N cards
export function dealHand(size: number): Card[] {
  const hand: Card[] = [];
  for (let i = 0; i < size; i++) {
    hand.push(getRandomCard());
  }
  return hand;
}

// Calculate blackjack hand value
export function calculateHandValue(hand: Card[]): number {
  let total = 0;
  let aceCount = 0;

  for (const card of hand) {
    total += VALUES[card.value];
    if (card.value === "A") aceCount++;
  }

  while (total > 21 && aceCount > 0) {
    total -= 10;
    aceCount--;
  }
  return total;
}
