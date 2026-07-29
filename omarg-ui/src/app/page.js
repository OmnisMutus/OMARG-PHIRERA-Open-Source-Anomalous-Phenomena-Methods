"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { stringToChaoticArray, diagnoseSephira, calculateEntropy } from '../lib/symbolicDebugger';
import { ALGO_MAP, mergeSort } from '../lib/sephiroticSorting';
import beatMap from '../lib/beatmap.json' with { type: "json" };
import { RitualScheduler } from '../lib/uiScheduler';
import { UIFlow } from '../lib/uiFlow';

const CAVEATS = [
  "This is a snapshot, not a score.",
  "Measures coherence, not correctness.",
  "Pattern detection, not diagnosis."
];

// Simple Web Audio API for ritual sounds
class RitualAudio {
  constructor() {
    this.ctx = null;
  }
  init() {
    if (typeof window === 'undefined') return;
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }
  playClick() {
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.1);
    } catch (e) {
      console.warn("Audio playClick error", e);
    }
  }
  playPulse() {
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(432, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 3.0);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 3.0);
    } catch (e) {
      console.warn("Audio playPulse error", e);
    }
  }
}

export default function Home() {
  const [inputText, setInputText] = useState('');
  const [nodes, setNodes] = useState([]);
  const [activeIndices, setActiveIndices] = useState([]);
  
  const [sephira, setSephira] = useState(null);
  const [entropy, setEntropy] = useState(0.0);
  const [currentCaveat, setCurrentCaveat] = useState(CAVEATS[0]);
  const [tradition, setTradition] = useState('Kabbalah');
  
  const [status, setStatus] = useState('Awaiting Input (Tohu)...');
  const [isSorting, setIsSorting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  const [ritualId, setRitualId] = useState('');
  
  // Anti-Optimization State
  const lastRunTimeRef = useRef(0);
  const runCountRef = useRef(0);
  
  const generatorRef = useRef(null);
  const animationRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current = new RitualAudio();
  }, []);

  const sendTelemetry = useCallback(async (event_type) => {
    try {
      const now = Date.now();
      const timeSinceLastRun = now - lastRunTimeRef.current;
      // Flag rapid re-runs (< 3 seconds) or obsessive looping (> 5 runs in session)
      const metricFixation = (timeSinceLastRun < 3000 && lastRunTimeRef.current !== 0) || (runCountRef.current > 5);

      await fetch('/api/telemetry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: event_type,
          ritual_id: ritualId || Date.now().toString(),
          sephira: sephira,
          entropy: entropy,
          tradition: tradition,
          algorithm: sephira ? (ALGO_MAP[sephira]?.name || "Fallback") : "None",
          array_size: nodes.length,
          metric_fixation_warning: metricFixation
        })
      });
      
      if (event_type === "ritual_complete") {
        lastRunTimeRef.current = now;
      }
    } catch (e) {
      console.warn("Telemetry bridge disconnected");
    }
  }, [ritualId, sephira, entropy, nodes.length, tradition]);

  const startRitual = () => {
    if (!inputText.trim()) return;
    
    if (soundEnabled) audioRef.current?.init();
    
    runCountRef.current += 1;
    const newRitualId = Date.now().toString();
    setRitualId(newRitualId);
    
    // Rotate caveat
    setCurrentCaveat(CAVEATS[Math.floor(Math.random() * CAVEATS.length)]);
    
    // 1. Hash to Chaos
    const initialArray = stringToChaoticArray(inputText);
    setNodes(initialArray);
    setIsComplete(false);
    
    // 2. Diagnose & Entropy
    const diagnosedSephira = diagnoseSephira(inputText);
    const hs = calculateEntropy(inputText);
    
    setSephira(diagnosedSephira || "Daath");
    setEntropy(hs);
    
    // 3. Select Algorithm (Fallback to Merge if unmapped)
    const sortAlgo = ALGO_MAP[diagnosedSephira] || ALGO_MAP["Tiphareth"] || mergeSort;
    
    // 4. Initialize Generator
    generatorRef.current = sortAlgo(initialArray);
    setIsSorting(true);
    setStatus(`Diagnosis: ${diagnosedSephira || 'Unknown'}. Initiating Tikun...`);

    // 5. Start Timeline Scheduler
    if (audioRef.current?.ctx) {
      if (!schedulerRef.current) {
        schedulerRef.current = new RitualScheduler(beatMap, (section) => {
          UIFlow.transitionTo(section, 1.0 - hs);
        });
      }
      schedulerRef.current.start(audioRef.current.ctx);
    }
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
      animationRef.current = setTimeout(stepSort, 150);
    }
    return () => clearTimeout(animationRef.current);
  }, [nodes, isSorting]);

  const acknowledgeMirror = () => {
    sendTelemetry("acknowledged_mirror");
    setNodes([]);
    setInputText('');
    setIsComplete(false);
    setSephira(null);
    setEntropy(0.0);
    setStatus('Awaiting Input (Tohu)...');
  };

  const visibleNodes = nodes.slice(0, 20);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 lg:p-12 relative z-10 font-sans text-gray-100">
      <div className="w-full max-w-6xl glass-container border border-white/10 rounded-2xl p-6 shadow-2xl backdrop-blur-xl bg-black/40">
        
        {/* Top Consolidated Command Bar */}
        <header className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-6 border-b border-white/10 gap-4">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              OMARG OBSERVATORY
            </h1>
            <p className="text-xs text-gray-400 font-mono tracking-widest uppercase mt-1">
              The Mirror of Tikun
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <a 
              href="/compare" 
              className="text-xs font-mono tracking-wider uppercase px-3 py-1.5 rounded border border-yellow-500/40 text-yellow-400 bg-yellow-500/10 hover:bg-yellow-500/20 transition"
            >
              Meta-Cartography Engine
            </a>
            
            <button 
              className="text-xs font-mono px-3 py-1.5 rounded border border-white/10 text-gray-400 hover:text-white bg-white/5 transition"
              onClick={() => setSoundEnabled(!soundEnabled)}
            >
              Sound: {soundEnabled ? "ON" : "OFF"}
            </button>
            
            <select 
              className="bg-black/60 text-xs font-mono text-gray-300 border border-white/10 rounded px-3 py-1.5 outline-none focus:border-white/30"
              value={tradition}
              onChange={(e) => setTradition(e.target.value)}
            >
              <option value="Kabbalah">Kabbalah</option>
              <option value="Zen">Zen</option>
              <option value="CBT">CBT</option>
              <option value="Neuroscience">Neuroscience</option>
            </select>
          </div>
        </header>
        
        {/* Anti-Optimization Metric Header Bar */}
        <div className="flex items-center justify-between min-h-[32px] px-4 py-2 mb-6 rounded-lg bg-white/5 border border-white/5 font-mono text-xs text-gray-400">
          <div>
            <span className="text-gray-500">STATUS:</span> <span className="text-yellow-400">{status}</span>
          </div>
          {(isSorting || isComplete) && (
            <div className="flex items-center gap-3">
              <span className="px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-300 font-bold">Hₛ = {entropy.toFixed(2)}</span>
              <span className="text-gray-400 hidden sm:inline">| {currentCaveat}</span>
            </div>
          )}
        </div>

        {/* 2-Column Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Control & Input Deck (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-mono text-gray-400 uppercase tracking-widest">
                Utterance Input (State Injection)
              </label>
              <textarea 
                className="input-area w-full h-36 bg-black/50 border border-white/10 rounded-xl p-4 text-sm text-gray-100 placeholder-gray-600 focus:border-white/30 outline-none transition resize-none font-mono"
                placeholder="Describe your current state. (e.g. 'I feel rigid and stuck, unable to move forward')"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                disabled={isSorting || isComplete}
              />
            </div>
            
            {!isComplete && (
              <button 
                className="w-full py-3 bg-white hover:bg-gray-200 text-black font-mono font-bold text-xs uppercase tracking-widest rounded-xl transition disabled:opacity-40 disabled:cursor-not-allowed shadow-lg"
                onClick={startRitual}
                disabled={isSorting || !inputText.trim()}
                suppressHydrationWarning
              >
                {isSorting ? "Sorting State..." : "/sort-state"}
              </button>
            )}

            {/* The Mirror Acknowledgment Card */}
            <AnimatePresence>
              {isComplete && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-5 rounded-xl border border-yellow-500/30 bg-yellow-500/10 text-left space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-yellow-500/20 pb-2">
                    <h3 className="text-yellow-400 font-bold uppercase tracking-widest text-xs">
                      Poetics, Not Physics
                    </h3>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-300">
                      {sephira}
                    </span>
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed font-sans">
                    The sorting ritual you witnessed is a deterministic symbolic mirror. The system diagnosed a dominant resonance of <strong className="text-white font-mono">{sephira}</strong>.
                    <br/><br/>
                    This is a syntax. Bring your semantics.
                  </p>
                  <button 
                    className="w-full py-2.5 bg-yellow-500 hover:bg-yellow-400 text-black font-mono font-bold text-xs uppercase tracking-widest rounded-lg transition"
                    onClick={acknowledgeMirror}
                  >
                    I See the Mirror
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Visual Arena Deck (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col gap-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-mono text-gray-400 uppercase tracking-widest">
                Tikun Visual Arena
              </span>
              {nodes.length > 20 && (
                <span className="text-[10px] font-mono text-gray-500">
                  Showing 20 / {nodes.length} elements
                </span>
              )}
            </div>

            {/* Arena Container */}
            <div className={`arena w-full min-h-[280px] bg-black/60 border border-white/10 rounded-xl p-4 flex items-end justify-center gap-1.5 relative overflow-hidden sephira-${sephira || 'none'} ${isComplete ? 'complete' : ''}`}>
              <AnimatePresence>
                {visibleNodes.map((node, index) => {
                  const isActive = activeIndices.includes(index);
                  const height = Math.max(24, (node.value / 100) * 220);
                  const isTohu = !isSorting && !isComplete && nodes.length > 0;
                  
                  return (
                    <motion.div
                      key={`${node.id}-${index}`}
                      layout
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      className={`node flex-1 max-w-[28px] rounded-t-md text-[10px] font-mono flex items-start justify-center pt-1 border transition-all ${isActive ? 'active' : ''} ${isTohu ? 'tohu' : ''}`}
                      style={{ height: `${height}px` }}
                    >
                      {node.value}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
              
              {nodes.length === 0 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-600 font-mono text-xs gap-2">
                  <span className="w-2 h-2 rounded-full bg-gray-600 animate-ping"></span>
                  [ Awaiting State Injection ]
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </main>
  );
}
