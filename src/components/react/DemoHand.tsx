import PlayingCard from "./PlayingCard";

export default function DemoHand() {
  return (
    <div style={{ display: "flex", gap: "1rem" }}>
      <PlayingCard value="A" suit="spades" />
      <PlayingCard value="10" suit="hearts" />
      <PlayingCard value="7" suit="clubs" />
    </div>
  );
}
