import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
    Card as CardType, 
    dealHand as dealHandUtility,
    calculateHandValue 
} from '../../utils/cards';
import PlayingCard from './PlayingCard';

interface CardContainerProps {
    card: CardType;
}

const CardContainer: React.FC<CardContainerProps> = ({ card }) => {
    return (
        <div className="card-container">
            <PlayingCard value={card.value} suit={card.suit} />
        </div>
    );
};

const CardValueTrainer: React.FC = () => {
    const [currentHand, setCurrentHand] = useState<CardType[]>([]);
    const [correctValue, setCorrectValue] = useState<number>(0);
    const [userAnswer, setUserAnswer] = useState<string>('');
    const [feedback, setFeedback] = useState<{ message: string, className: string }>({ 
        message: 'Click "Deal New Hand" to start!', 
        className: 'feedback-msg' 
    });

    const dealHand = useCallback(() => {
        const handSize = Math.floor(Math.random() * 3) + 2; 
        const newHand = dealHandUtility(handSize);

        setCurrentHand(newHand);
        setCorrectValue(calculateHandValue(newHand));
        setUserAnswer('');
        setFeedback({ message: '', className: 'feedback-msg' });
    }, []);

    useEffect(() => {
        dealHand();
    }, [dealHand]);

    const checkAnswer = () => {
        const answer = parseInt(userAnswer, 10);
        
        if (isNaN(answer)) {
            setFeedback({ message: 'Please enter a valid number.', className: 'feedback-msg incorrect' });
            return;
        }

        if (answer === correctValue) {
            setFeedback({ 
                message: `Correct! The value is ${correctValue}.`, 
                className: 'feedback-msg correct' 
            });
        } else {
            setFeedback({ 
                message: `Not quite. The correct value is ${correctValue}.`, 
                className: 'feedback-msg incorrect' 
            });
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            checkAnswer();
        }
    };
    
    const handComponents = useMemo(() => 
        currentHand.map((card, index) => (
            <CardContainer key={index} card={card} /> 
        )), [currentHand]
    );

    return (
        <section className="dealer-note" style={containerStyles}>
            <div className="note-header">
                <span className="icon">🧠</span>
                <h3>Interactive Drill: Hand Value Trainer</h3>
            </div>
            <div className="note-body">
                <p>Calculate the total value of the hand shown. Aces (A) count as 11 unless the total is over 21, then they count as 1.</p>
                
                <div id="hand-display" className="hand-container">
                    {handComponents}
                </div>
                
                <div className="controls-container">
                    <div className="input-group">
                        <label htmlFor="hand-value-input">Your Answer:</label>
                        <input 
                            type="number" 
                            id="hand-value-input" 
                            placeholder="Enter total"
                            value={userAnswer}
                            onChange={(e) => setUserAnswer(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                    </div>
                    <button 
                        id="check-answer-btn" 
                        className="trainer-btn check"
                        onClick={checkAnswer}
                    >
                        Check
                    </button>
                    <button 
                        id="deal-hand-btn" 
                        className="trainer-btn deal"
                        onClick={dealHand}
                    >
                        Deal New Hand
                    </button>
                </div>

                <div id="feedback-message" className={feedback.className}>
                    {feedback.message}
                </div>
            </div>
            
            <style>{`
                .dealer-note {
                    position: relative;
                    background: rgba(90, 75, 255, 0.15); 
                    border-radius: 12px;
                    padding: 1.5rem 2rem;
                    margin: 2rem 0;
                    color: #f5f5f5;
                    box-shadow: 0 0 20px rgba(0, 230, 168, 0.25);
                    border: 1px solid rgba(0, 230, 168, 0.2);
                    backdrop-filter: blur(6px);
                }
                .note-header {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    margin-bottom: 1rem;
                }
                .note-header .icon {
                    font-size: 1.5rem;
                }
                .note-header h3 {
                    font-size: 1.2rem;
                    color: #00e6a8;
                    margin: 0;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
                .note-body {
                    font-size: 1rem;
                    line-height: 1.6;
                    color: #b3b3b3;
                }
                .note-body p {
                    margin: 0.3rem 0;
                }
                .hand-container {
                    display: flex;
                    gap: 0.5rem;
                    margin: 1.5rem 0;
                    justify-content: center;
                    min-height: 120px;
                }
                .card-container {
                    width: 75px; 
                    height: 105px;
                    display: block; 
                    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                    border-radius: 12px;
                }
                .controls-container {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 1rem;
                    align-items: center;
                    margin-top: 1rem;
                }
                .input-group {
                    display: flex;
                    flex-direction: column;
                    gap: 0.25rem;
                }
                .input-group label {
                    font-size: 0.9rem;
                    color: #00e6a8;
                }
                .input-group input {
                    background: rgba(0,0,0,0.2);
                    border: 1px solid rgba(0, 230, 168, 0.2);
                    border-radius: 6px;
                    padding: 0.5rem 0.75rem;
                    color: #f5f5f5;
                    font-size: 1rem;
                    width: 120px;
                }
                .input-group input:focus {
                    outline: none;
                    border-color: #00e6a8;
                    box-shadow: 0 0 10px rgba(0, 230, 168, 0.5);
                }
                .trainer-btn {
                    padding: 0.6rem 1rem;
                    border: none;
                    border-radius: 6px;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    align-self: flex-end;
                }
                .trainer-btn.check {
                    background-color: #00e6a8;
                    color: #121212;
                }
                .trainer-btn.check:hover {
                    opacity: 0.8;
                }
                .trainer-btn.deal {
                    background-color: #5a4bff;
                    color: #f5f5f5;
                }
                .trainer-btn.deal:hover {
                    opacity: 0.8;
                }
                .feedback-msg {
                    margin-top: 1rem;
                    font-size: 1.1rem;
                    font-weight: 600;
                    min-height: 1.5rem;
                }
                .feedback-msg.correct {
                    color: #00e6a8;
                }
                .feedback-msg.incorrect {
                    color: #ff4d4d;
                }
            `}</style>
        </section>
    );
};

const containerStyles: React.CSSProperties = {
    position: 'relative',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
};

export default CardValueTrainer;