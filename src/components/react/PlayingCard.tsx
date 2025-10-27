import React from "react";
import { CardValue, Suit } from "../utils/cards"; // Import types from your utility file

interface PlayingCardProps {
  value: CardValue; // "2"–"10", "J", "Q", "K", "A"
  suit: Suit;
}

export default function PlayingCard({ value, suit }: PlayingCardProps) {
  const isRed = suit === "hearts" || suit === "diamonds";
  const suitSymbol = {
    spades: "♠",
    hearts: "♥",
    clubs: "♣",
    diamonds: "♦",
  }[suit];

  const color = isRed ? "#FF4B5C" : "#000"; // red suits vs black suits

  // The viewBox defines the internal coordinate system (150x210)
  // The width/height attributes on the SVG define the displayed size.
  // We use 100% width and 100% height to make it scale within its container (CardContainer below).
  return (
    <svg
      viewBox="0 0 150 210"
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
      className="playing-card"
    >
      {/* Card background */}
      <rect
        width="150"
        height="210"
        rx="12"
        fill="#FFFFFF"
        stroke="#00E6A8"
        strokeWidth="3"
      />

      {/* Top-left value + suit */}
      <text
        x="15"
        y="30"
        fill={color}
        fontSize="28" // Increased font slightly
        fontFamily="sans-serif"
        fontWeight="bold"
      >
        {value}
      </text>
      <text
        x="15"
        y="55"
        fill={color}
        fontSize="24" // Increased font slightly
        fontFamily="sans-serif"
      >
        {suitSymbol}
      </text>

      {/* Center suit symbol */}
      <text
        x="75"
        y="115"
        textAnchor="middle"
        fill={color}
        fontSize="60"
        fontFamily="sans-serif"
      >
        {suitSymbol}
      </text>

      {/* Bottom-right value + suit (mirrored) */}
      <g transform="rotate(180, 135, 180)">
        <text
          x="135"
          y="180"
          fill={color}
          fontSize="28" // Increased font slightly
          fontFamily="sans-serif"
          fontWeight="bold"
        >
          {value}
        </text>
        <text
          x="135"
          y="205"
          fill={color}
          fontSize="24" // Increased font slightly
          fontFamily="sans-serif"
        >
          {suitSymbol}
        </text>
      </g>
    </svg>
  );
}
