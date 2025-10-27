import { useState, useEffect } from "react";
import phrasePanelBg from "../../assets/phrase-panel-bg.svg";

const CARDS = ["2","3","4","5","6","7","8","9","T","J","Q","K","A"];
const VALUES: Record<string, number> = {
  "2":2,"3":3,"4":4,"5":5,"6":6,"7":7,"8":8,"9":9,
  "T":10,"J":10,"Q":10,"K":10,"A":11
};
const SUITS: Record<string,"red"|"black"> = {
  spades:"black", clubs:"black", hearts:"red", diamonds:"red"
};

export default function CardValueTrainer() {
  const [hand, setHand] = useState<string[]>([]);
  const [correctValue, setCorrectValue] = useState(0);
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState<string>("Click \"Deal New Hand\" to start!");
  const [feedbackClass, setFeedbackClass] = useState("");

  function calculateHandValue(cards: string[]) {
    let total = 0, aceCount = 0;
    for (const c of cards) {
      total += VALUES[c];
      if (c === "A") aceCount++;
    }
    while (total > 21 && aceCount > 0) {
      total -= 10;
      aceCount--;
    }
    return total;
  }

  function dealHand() {
    const size = Math.floor(Math.random() * 3) + 2;
    const newHand: string[] = [];
    for (let i=0;i<size;i++) {
      newHand.push(CARDS[Math.floor(Math.random()*CARDS.length)]);
    }
    setHand(newHand);
    setCorrectValue(calculateHandValue(newHand));
    setInput("");
    setFeedback("");
    setFeedbackClass("");
  }

  function checkAnswer() {
    const val = parseInt(input,10);
    if (isNaN(val)) {
      setFeedback("Please enter a number.");
      setFeedbackClass("incorrect");
      return;
    }
    if (val === correctValue) {
      setFeedback(`Correct! The value is ${correctValue}.`);
      setFeedbackClass("correct");
    } else {
      setFeedback(`Not quite. The correct value is ${correctValue}.`);
      setFeedbackClass("incorrect");
    }
  }

  useEffect(() => {
    dealHand(); // deal first hand on mount
  }, []);

  return (
    <section className="dealer-note" style={{backgroundImage:`url(${phrasePanelBg.src})`}}>
      <div className="note-header">
        <span className="icon">🧠</span>
        <h3>Interactive Drill: Hand Value Trainer</h3>
      </div>
      <div className="note-body">
        <p>Calculate the total value of the hand shown. Aces (A) count as 11 unless the total is over 21, then they count as 1.</p>

        <div className="hand-container">
          {hand.map((c,i) => {
            const suitKeys = Object.keys(SUITS);
            const randomSuit = suitKeys[Math.floor(Math.random()*suitKeys.length)];
            return (
              <div key={i} className={`card ${SUITS[randomSuit]}`}>{c}</div>
            );
          })}
        </div>

        <div className="controls-container">
          <div className="input-group">
            <label htmlFor="hand-value-input">Your Answer:</label>
            <input
              id="hand-value-input"
              type="number"
              value={input}
              onChange={e=>setInput(e.target.value)}
              onKeyUp={e=>{ if(e.key==="Enter") checkAnswer(); }}
            />
          </div>
          <button className="trainer-btn check" onClick={checkAnswer}>Check</button>
          <button className="trainer-btn deal" onClick={dealHand}>Deal New Hand</button>
        </div>

        <div className={`feedback-msg ${feedbackClass}`}>{feedback}</div>
      </div>
    </section>
  );
}
