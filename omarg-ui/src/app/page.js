"use client";

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { stringToChaoticArray, diagnoseSephira } from '../lib/symbolicDebugger';
import { ALGO_MAP } from '../lib/sephiroticSorting';

export default function Home() {
  const [inputText, setInputText] = useState('');
  const [nodes, setNodes] = useState([]);
  const [activeIndices, setActiveIndices] = useState([]);
  const [sephira, setSephira] = useState(null);
  const [status, setStatus] = useState('Awaiting Input (Tohu)...');
  const [isSorting, setIsSorting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  
  // Ref to hold the generator so we can step through it
  const generatorRef = useRef(null);
  const animationRef = useRef(null);

  const startRitual = () => {
    if (!inputText.trim()) return;
    
    // 1. Hash to Chaos
    const initialArray = stringToChaoticArray(inputText);
    setNodes(initialArray);
    setIsComplete(false);
    
    // 2. Diagnose
    const diagnosedSephira = diagnoseSephira(inputText);
    setSephira(diagnosedSephira);
    
    // 3. Select Algorithm
    const sortAlgo = ALGO_MAP[diagnosedSephira];
    
    // 4. Initialize Generator
    generatorRef.current = sortAlgo(initialArray);
    setIsSorting(true);
    setStatus(`Diagnosis: ${diagnosedSephira}. Initiating Tikun...`);
  };

  const stepSort = () => {
    if (!generatorRef.current) return;
    
    const { value, done } = generatorRef.current.next();
    
    if (done || (value && value.complete)) {
      setIsSorting(false);
      setIsComplete(true);
      setActiveIndices([]);
      setStatus(value?.description || "Tikun Complete.");
      return;
    }
    
    if (value) {
      setNodes(value.array);
      setActiveIndices(value.activeIndices || []);
      setStatus(value.description);
    }
  };

  // Animation Loop
  useEffect(() => {
    if (isSorting) {
      // Speed of animation
      animationRef.current = setTimeout(stepSort, 300);
    }
    return () => clearTimeout(animationRef.current);
  }, [nodes, isSorting]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 lg:p-24">
      <div className="w-full max-w-4xl glass-container">
        
        <header className="mb-8 text-center">
          <h1 className="title">OMARG OBSERVATORY</h1>
          <p className="subtitle">The Mirror of Tikun</p>
        </header>

        {/* The Sorting Arena */}
        <div className={`arena mb-8 sephira-${sephira || 'none'}`}>
          <AnimatePresence>
            {nodes.map((node, index) => {
              const isActive = activeIndices.includes(index);
              // Calculate height based on value (0-100)
              const height = Math.max(20, (node.value / 100) * 200);
              
              return (
                <motion.div
                  key={node.id}
                  layout
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 400, 
                    damping: 30 
                  }}
                  className={`node ${isActive ? 'active' : ''}`}
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
            disabled={isSorting}
          />
          <button 
            className="btn"
            onClick={startRitual}
            disabled={isSorting || !inputText.trim()}
          >
            {isSorting ? "Sorting..." : "/sort-state"}
          </button>
        </div>

        {/* The Mirror Acknowledgment */}
        <AnimatePresence>
          {isComplete && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 p-4 rounded-lg border border-yellow-500/30 bg-yellow-500/10"
            >
              <h3 className="text-yellow-500 font-bold mb-2 uppercase text-sm">Ethical API Caveat</h3>
              <p className="text-sm text-gray-300">
                The sorting ritual you just witnessed is a symbolic mirror generated deterministically from your own words. 
                The system diagnosed a dominant resonance of <strong className="text-white">{sephira}</strong>.
                <br/><br/>
                Does this pattern reflect a truth you recognize?
              </p>
            </motion.div>
          )}
        </AnimatePresence>
        
      </div>
    </main>
  );
}
