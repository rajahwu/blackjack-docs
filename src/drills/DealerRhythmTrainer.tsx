import React, { useState, useCallback, useEffect } from 'react';
// Components: CORRECTED PATHS
// The original path was '../components/react/SessionTimer.tsx'.
// Since that failed, we must assume a different directory root is being used by the build.
// Let's try navigating up two levels (to 'src/') and then down to the components.
// Path from 'src/drills/' to 'src/components/react/':
// Go up one level to 'src/' -> Go down to 'components/react/'
// The original path was CORRECT: '../components/react/'
// Since it failed, we will use the correct relative path again, but without the .tsx extension, which often causes resolution issues in certain bundlers.
import SessionTimer from '../components/react/SessionTimer'; 
import BeatTable from '../components/react/BeatTable'; 
import DrillLogForm from '../components/react/DrillLogForm';

// --- Drill Component ---
const DealerRhythmTrainer: React.FC = () => {
    // State for the BPM/Interval
    const [bpm, setBpm] = useState(60);
    const [beatsPerInterval, setBeatsPerInterval] = useState(4);
    const [isRunning, setIsRunning] = useState(false);
    
    // Log state, to be submitted via DrillLogForm
    const [sessionLogs, setSessionLogs] = useState<{ duration: number, bpm: number, interval: number, misses: number }[]>([]);

    // Function to handle the completion of a drill session
    const handleSessionEnd = useCallback((totalTimeSeconds: number, misses: number) => {
        setIsRunning(false);
        const newLog = {
            duration: totalTimeSeconds,
            bpm,
            interval: beatsPerInterval,
            misses,
        };
        // Temporarily store the log entry locally
        setSessionLogs((prev) => [...prev, newLog]);
        
        // Show feedback (could be a modal in a more complex setup)
        console.log("Session Ended:", newLog);
    }, [bpm, beatsPerInterval]);


    // Placeholder for a detailed rhythm check (to be implemented inside BeatTable or a dedicated hook)
    // For now, BeatTable handles its own internal beat timing and "miss" count.
    
    return (
        <section className="dealer-note rhythm-trainer-wrapper">
            <div className="note-header">
                <span className="icon">🥁</span>
                <h3>Dealer Rhythm Trainer</h3>
            </div>
            
            <div className="note-body">
                <p className="mb-4 text-gray-300">
                    Practice dealing and pacing to a consistent beat. The timer will track your session, and the beat table provides visual and auditory feedback for your rhythm.
                </p>

                {/* BPM Controls */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8 p-4 bg-gray-900/40 rounded-xl border border-teal-500/20">
                    <div className="flex-1">
                        <label htmlFor="bpm-input" className="block text-sm font-medium text-teal-400 mb-1">Target BPM (Beats per Minute):</label>
                        <input
                            id="bpm-input"
                            type="number"
                            min="30"
                            max="180"
                            value={bpm}
                            onChange={(e) => setBpm(Math.max(30, Math.min(180, parseInt(e.target.value) || 0)))}
                            className="w-full p-2 bg-gray-700/50 rounded-lg text-white border border-transparent focus:border-teal-500 focus:ring-teal-500 transition"
                            disabled={isRunning}
                        />
                    </div>
                    <div className="flex-1">
                        <label htmlFor="interval-input" className="block text-sm font-medium text-teal-400 mb-1">Beats per Interval (Clap Grouping):</label>
                        <input
                            id="interval-input"
                            type="number"
                            min="2"
                            max="8"
                            value={beatsPerInterval}
                            onChange={(e) => setBeatsPerInterval(Math.max(2, Math.min(8, parseInt(e.target.value) || 0)))}
                            className="w-full p-2 bg-gray-700/50 rounded-lg text-white border border-transparent focus:border-teal-500 focus:ring-teal-500 transition"
                            disabled={isRunning}
                        />
                    </div>
                </div>

                {/* Timer and Beat Table */}
                <div className="flex flex-col lg:flex-row gap-6 items-start">
                    <div className="w-full lg:w-1/2">
                        {/* SessionTimer needs to control isRunning state */}
                        <SessionTimer 
                            isRunning={isRunning} 
                            setIsRunning={setIsRunning} 
                            onSessionEnd={handleSessionEnd}
                        />
                    </div>
                    <div className="w-full lg:w-1/2">
                        <BeatTable 
                            bpm={bpm} 
                            beatsPerInterval={beatsPerInterval} 
                            isRunning={isRunning}
                            onMiss={(misses) => console.log('Current Miss Count:', misses)} // Example: BeatTable can track misses
                        />
                    </div>
                </div>
                
                <hr className="my-8 border-gray-700/50" />

                {/* Log Form Integration - Step 2 from your plan */}
                <h4 className="text-xl font-bold text-teal-400 mb-4">Log Your Practice</h4>
                <DrillLogForm drillName="Rhythm Trainer" latestMetrics={sessionLogs.length > 0 ? sessionLogs[sessionLogs.length - 1] : {}} />
            </div>
            
            <style jsx global>
                {`
                /* Styling to ensure consistency with DealerNote.astro context */
                .rhythm-trainer-wrapper {
                    background: rgba(90, 75, 255, 0.15); 
                    border-radius: 12px;
                    padding: 1.5rem 2rem;
                    color: #f5f5f5;
                    box-shadow: 0 0 20px rgba(0, 230, 168, 0.25);
                    border: 1px solid rgba(0, 230, 168, 0.2);
                    backdrop-filter: blur(6px);
                }
                .rhythm-trainer-wrapper .note-header h3 {
                    color: #00e6a8;
                }
                `}
            </style>
        </section>
    );
};

export default DealerRhythmTrainer;
