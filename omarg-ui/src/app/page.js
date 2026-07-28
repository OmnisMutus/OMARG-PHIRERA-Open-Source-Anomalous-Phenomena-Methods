"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { stringToChaoticArray, diagnoseSephira } from '../lib/symbolicDebugger';
import { ALGO_MAP } from '../lib/sephiroticSorting';

// Simple Web Audio API for ritual sounds
class RitualAudio {
  constructor() {
    this.ctx = null;
  }
  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
  }
  playClick() {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.1);
  }
  playPulse() {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(432, this.ctx.currentTime); // The resonant frequency
    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 3.0);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 3.0);
  }
}

export default function Home() {
  const [inputText, setInputText] = useState('');
  const [nodes, setNodes] = useState([]);
  const [activeIndices, setActiveIndices] = useState([]);
  const [sephira, setSephira] = useState(null);
  const [status, setStatus] = useState('Awaiting Input (Tohu)...');
  const [isSorting, setIsSorting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [ritualId, setRitualId] = useState('');
  
  const generatorRef = useRef(null);
  const animationRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current = new RitualAudio();
  }, []);

  const sendTelemetry = useCallback(async (event_type) => {
    try {
      await fetch('/api/telemetry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: event_type,
          ritual_id: ritualId || Date.now().toString(),
          sephira: sephira,
          algorithm: sephira ? (ALGO_MAP[sephira]?.name || "Fallback") : "None",
          array_size: nodes.length
        })
      });
    } catch (e) {
      console.warn("Telemetry bridge disconnected");
    }
  }, [ritualId, sephira, nodes.length]);

  const startRitual = () => {
    if (!inputText.trim()) return;
    
    if (soundEnabled) audioRef.current?.init();
    
    const newRitualId = Date.now().toString();
    setRitualId(newRitualId);
    
    // 1. Hash to Chaos
    const initialArray = stringToChaoticArray(inputText);
    setNodes(initialArray);
    setIsComplete(false);
    
    // 2. Diagnose
    const diagnosedSephira = diagnoseSephira(inputText);
    setSephira(diagnosedSephira || "Daath"); // Fallback if no keywords found
    
    // 3. Select Algorithm (Fallback to Merge if Daath)
    const sortAlgo = ALGO_MAP[diagnosedSephira] || ALGO_MAP["Tiphareth"];
    
    // 4. Initialize Generator
    generatorRef.current = sortAlgo(initialArray);
    setIsSorting(true);
    setStatus(`Diagnosis: ${diagnosedSephira || 'Unknown'}. Initiating Tikun...`);
  };

  const stepSort = () => {
    if (!generatorRef.current) return;
    
    const { value, done } = generatorRef.current.next();
    
    if (done || (value && value.complete)) {
      setIsSorting(false);
      setIsComplete(true);
      setActiveIndices([]);
      setStatus(value?.description || "Tikun Complete.");
      if (soundEnabled) audioRef.current?.playPulse();
      
      // Log completion telemetry
      sendTelemetry("ritual_complete");
      return;
    }
    
    if (value) {
      setNodes(value.array);
      setActiveIndices(value.activeIndices || []);
      setStatus(value.description);
      if (soundEnabled) audioRef.current?.playClick();
    }
  };

  useEffect(() => {
    if (isSorting) {
      // Fast animation loop
      animationRef.current = setTimeout(stepSort, 150);
    }
    return () => clearTimeout(animationRef.current);
  }, [nodes, isSorting]);

  const acknowledgeMirror = () => {
    sendTelemetry("acknowledged_mirror");
    // Clear state back to Tohu
    setNodes([]);
    setInputText('');
    setIsComplete(false);
    setSephira(null);
    setStatus('Awaiting Input (Tohu)...');
  };

  // Performance cap: only visualize the first 20 nodes if array is massive
  const visibleNodes = nodes.slice(0, 20);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 lg:p-24 relative z-10">
      <div className="w-full max-w-4xl glass-container">
        
        <header className="mb-8 text-center">
          <h1 className="title">OMARG OBSERVATORY</h1>
          <p className="subtitle">The Mirror of Tikun</p>
          <button 
            className="text-xs text-gray-500 hover:text-gray-300 mt-2"
            onClick={() => setSoundEnabled(!soundEnabled)}
          >
            Sound: {soundEnabled ? "ON" : "OFF"}
          </button>
        </header>

        {/* The Sorting Arena */}
        <div className={`arena mb-4 sephira-${sephira || 'none'} ${isComplete ? 'complete' : ''}`}>
          <AnimatePresence>
            {visibleNodes.map((node, index) => {
              const isActive = activeIndices.includes(index);
              const height = Math.max(20, (node.value / 100) * 200);
              const isTohu = !isSorting && !isComplete && nodes.length > 0;
              
              return (
                <motion.div
                  key={node.id}
                  layout
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  className={`node ${isActive ? 'active' : ''} ${isTohu ? 'tohu' : ''}`}
                  style={{ height: `${height}px` }}
                >
                  {node.value}
                </motion.div>
              );
            })}
          </AnimatePresence>
          
          {nodes.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center text-gray-500 font-mono text-sm">
              [ Awaiting State Injection ]
            </div>
          )}
        </div>
        
        {nodes.length > 20 && (
          <div className="text-center text-xs text-gray-500 mb-4">
            Visualization simplified to 20 elements; full analysis logged.
          </div>
        )}

        {/* Status Output */}
        <div className="mb-6 text-center">
          <p className="status-text">{status}</p>
        </div>

        {/* Input Form */}
        <div className="flex flex-col gap-4">
          <textarea 
            className="input-area"
            placeholder="Describe your current state. (e.g. 'I feel rigid and stuck, unable to move forward' or 'I am completely scattered and overwhelmed')"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isSorting || isComplete}
          />
          {!isComplete && (
            <button 
              className="btn"
              onClick={startRitual}
              disabled={isSorting || !inputText.trim()}
            >
              {isSorting ? "Sorting..." : "/sort-state"}
            </button>
          )}
        </div>

        {/* The Mirror Acknowledgment (Ethical API) */}
        <AnimatePresence>
          {isComplete && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-8 p-6 rounded-lg border border-yellow-500/30 bg-yellow-500/10 text-center"
            >
              <h3 className="text-yellow-500 font-bold mb-4 uppercase tracking-widest text-sm">Poetics, Not Physics</h3>
              <p className="text-sm text-gray-300 mb-6">
                The sorting ritual you just witnessed is a symbolic mirror generated deterministically from your own words. 
                The system diagnosed a dominant resonance of <strong className="text-white">{sephira}</strong>.
                <br/><br/>
                This is a mirror, not a model. The pattern is yours to interpret.
              </p>
              <button 
                className="btn w-full bg-yellow-600 hover:bg-yellow-500 text-black font-bold uppercase tracking-widest"
                onClick={acknowledgeMirror}
              >
                I See the Mirror
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        
      </div>
    </main>
  );
}
