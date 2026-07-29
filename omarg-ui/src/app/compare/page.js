"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PrivacySeal from '@/components/PrivacySeal';
import { calculateEntropy, diagnoseSephira } from '@/lib/symbolicDebugger';

const ALL_TRADITIONS = [
  "Kabbalah",
  "Zen",
  "CBT",
  "Cybernetics",
  "Dynamical Systems / Chaos Theory",
  "Alchemy",
  "Analytical Psychology (Jung)",
  "Post-Structuralism (Deleuze / Guattari)",
  "Computer Science / Programming",
  "Quietism / Mystical Traditions"
];

export default function ComparePage() {
  const [mappings, setMappings] = useState({});
  const [traditionA, setTraditionA] = useState('Kabbalah');
  const [traditionB, setTraditionB] = useState('Dynamical Systems / Chaos Theory');
  
  // Live Ephemeral State Session
  const [stateInput, setStateInput] = useState('');
  const [stateHistory, setStateHistory] = useState([]);
  const [activeStateIndex, setActiveStateIndex] = useState(-1);
  const [comparisonResult, setComparisonResult] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Custom Ontology Upload
  const [customOntologyInput, setCustomOntologyInput] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');

  useEffect(() => {
    fetch('/mappings/cross_tradition_mappings.json')
      .then(res => res.json())
      .then(data => {
        setMappings(data.cross_tradition_mappings);
      })
      .catch(err => console.error("Failed to load mappings", err));
  }, []);

  const runComparison = async (source, target, text = '') => {
    if (!source || !target) return;
    setIsProcessing(true);

    try {
      const res = await fetch('/api/tradition-compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sourceTradition: source, targetTradition: target, text: text })
      });
      const data = await res.json();
      if (res.ok) {
        setComparisonResult(data.comparison);
        return data.comparison;
      }
    } catch (err) {
      console.error("Comparison error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddState = async () => {
    if (!stateInput.trim()) return;

    const hs = calculateEntropy(stateInput);
    const sephira = diagnoseSephira(stateInput) || "Daath";
    
    // Fetch live cross-tradition translation
    const comp = await runComparison(traditionA, traditionB, stateInput);

    const newState = {
      id: Date.now().toString(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      text: stateInput,
      hs: hs,
      sephira: sephira,
      comparison: comp
    };

    const updated = [...stateHistory, newState];
    setStateHistory(updated);
    setActiveStateIndex(updated.length - 1);
    setStateInput('');
  };

  useEffect(() => {
    if (traditionA && traditionB) {
      const currentText = activeStateIndex >= 0 && stateHistory[activeStateIndex] ? stateHistory[activeStateIndex].text : '';
      runComparison(traditionA, traditionB, currentText);
    }
  }, [traditionA, traditionB]);

  const exportSessionJSON = () => {
    const exportData = {
      notice: "EPHEMERAL SESSION EXPORT - Generated locally in browser. No server copy exists.",
      exported_at: new Date().toISOString(),
      source_tradition: traditionA,
      target_tradition: traditionB,
      history: stateHistory.map(s => ({
        timestamp: s.time,
        text: s.text,
        entropy_Hs: s.hs,
        diagnosed_sephira: s.sephira,
        concept_translation: s.comparison?.concept_translation || null
      }))
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rs_session_ephemeral_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleUpload = async () => {
    try {
      setUploadError('');
      setUploadSuccess('');
      const parsed = JSON.parse(customOntologyInput);
      
      const res = await fetch('/api/validate-ontology', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed)
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Validation failed');
      
      setMappings(prev => ({ ...prev, ...data.ontology }));
      const newName = Object.keys(data.ontology)[0];
      setTraditionA(newName);
      setCustomOntologyInput('');
      setUploadSuccess(`Ontology "${newName}" loaded into session memory.`);
    } catch (err) {
      setUploadError(err.message);
    }
  };

  const activeState = activeStateIndex >= 0 ? stateHistory[activeStateIndex] : null;

  return (
    <main className="flex min-h-screen flex-col items-center p-4 lg:p-12 relative z-10 overflow-auto bg-black text-gray-100 font-sans">
      <div className="w-full max-w-7xl glass-container">
        
        {/* Header */}
        <header className="mb-4 text-center border-b border-gray-800 pb-4">
          <h1 className="title text-3xl font-bold tracking-wider">META-CARTOGRAPHY ENGINE</h1>
          <p className="subtitle text-sm text-yellow-500/80 font-mono mt-1">Live State Mapping & Ephemeral Cross-Translation</p>
          
          <div className="flex justify-center items-center gap-4 mt-3">
            <a href="/" className="text-xs text-gray-400 hover:text-yellow-400 font-mono transition-colors">← Return to Observatory</a>
            {stateHistory.length > 0 && (
              <button 
                onClick={exportSessionJSON}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-mono border border-emerald-500/40 px-2 py-1 rounded bg-emerald-950/30 transition-colors"
              >
                📥 Export Session (Client-Only JSON)
              </button>
            )}
          </div>
        </header>

        {/* Privacy Seal */}
        <PrivacySeal />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Live State Logger & Ontology Ingestion (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* Live State Observation Stream */}
            <div className="p-4 border border-gray-800 rounded-lg bg-gray-950/80">
              <h2 className="text-sm font-mono text-yellow-500 uppercase tracking-widest mb-2 flex justify-between items-center">
                <span>1. State Observation Stream</span>
                <span className="text-[10px] text-emerald-400 font-normal">● LIVE IN-MEMORY</span>
              </h2>
              <p className="text-xs text-gray-400 mb-3">
                Log your psychological/energetic shifts in real time. Notice patterns as they emerge and dissolve.
              </p>
              
              <textarea 
                className="w-full h-24 bg-black border border-gray-800 rounded p-2 text-xs font-mono text-gray-200 focus:border-yellow-500 focus:outline-none mb-2"
                placeholder="Log current state observation... (e.g. 'Feeling rigid and trapped in analysis' or 'Breath deepening, expansion in chest')"
                value={stateInput}
                onChange={(e) => setStateInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleAddState(); }}
              />
              
              <button 
                className="btn w-full text-xs py-2 bg-yellow-600/20 border border-yellow-500/40 hover:bg-yellow-500 hover:text-black font-mono transition-all"
                onClick={handleAddState}
                disabled={!stateInput.trim() || isProcessing}
              >
                + Log Observation Point (Ctrl+Enter)
              </button>

              {/* Logged States Timeline List */}
              {stateHistory.length > 0 && (
                <div className="mt-4 border-t border-gray-800 pt-3">
                  <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider block mb-2">
                    Ephemeral Timeline ({stateHistory.length} points)
                  </span>
                  <div className="max-h-40 overflow-y-auto flex flex-col gap-1.5 pr-1">
                    {stateHistory.map((st, idx) => (
                      <div 
                        key={st.id}
                        onClick={() => setActiveStateIndex(idx)}
                        className={`p-2 rounded border text-xs cursor-pointer transition-all flex justify-between items-center ${
                          activeStateIndex === idx 
                            ? 'border-yellow-500/60 bg-yellow-500/10 text-yellow-300' 
                            : 'border-gray-800 bg-black/40 text-gray-400 hover:border-gray-700'
                        }`}
                      >
                        <div className="truncate mr-2 font-mono">
                          <span className="text-[10px] text-gray-500 mr-1.5">[{st.time}]</span>
                          {st.text}
                        </div>
                        <span className="text-[10px] font-mono shrink-0 px-1.5 py-0.5 rounded bg-gray-900 border border-gray-800 text-gray-300">
                          Hₛ {st.hs.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Lens Selectors */}
            <div className="p-4 border border-gray-800 rounded-lg bg-gray-950/80">
              <h2 className="text-sm font-mono text-yellow-500 uppercase tracking-widest mb-3">2. Dual-Lens Translation Selector</h2>
              
              <label className="block text-xs text-gray-400 mb-1 font-mono">Source Lens (Input Framing)</label>
              <select 
                className="w-full bg-black border border-gray-800 rounded p-2 text-xs text-gray-200 mb-3 focus:border-yellow-500 focus:outline-none font-mono"
                value={traditionA}
                onChange={(e) => setTraditionA(e.target.value)}
              >
                {Object.keys(mappings).map(k => <option key={k} value={k}>{k}</option>)}
              </select>

              <label className="block text-xs text-gray-400 mb-1 font-mono">Target Lens (Projection Framing)</label>
              <select 
                className="w-full bg-black border border-gray-800 rounded p-2 text-xs text-gray-200 focus:border-yellow-500 focus:outline-none font-mono"
                value={traditionB}
                onChange={(e) => setTraditionB(e.target.value)}
              >
                {Object.keys(mappings).map(k => <option key={k} value={k}>{k}</option>)}
              </select>
            </div>

            {/* Personal Ontology Ingestion */}
            <div className="p-4 border border-gray-800 rounded-lg bg-gray-950/80">
              <h2 className="text-sm font-mono text-yellow-500 uppercase tracking-widest mb-1">3. Ingest Personal Cosmology</h2>
              <p className="text-[11px] text-gray-400 mb-3 leading-relaxed">
                Inject custom JSON mappings into browser memory for cross-translation.
              </p>
              <textarea 
                className="w-full h-24 bg-black border border-gray-800 rounded p-2 text-[10px] font-mono text-gray-300 focus:border-yellow-500 focus:outline-none mb-2"
                placeholder='{"name": "MyPersonalMap", "mapping": {"structure_type": "...", "structural_pattern": "...", "recursive_interpretation": "...", "corresponding_operators": ["ϕ", "ω"], "core_concept": "..."}}'
                value={customOntologyInput}
                onChange={(e) => setCustomOntologyInput(e.target.value)}
              />
              {uploadError && <p className="text-red-400 text-xs mb-2 font-mono">{uploadError}</p>}
              {uploadSuccess && <p className="text-emerald-400 text-xs mb-2 font-mono">{uploadSuccess}</p>}
              <button 
                className="btn w-full text-xs py-1.5 border-gray-700 hover:border-yellow-500 transition-colors font-mono" 
                onClick={handleUpload}
              >
                Validate & Load Ontology
              </button>
            </div>

          </div>

          {/* Right Column: Dynamic Live Dashboard (8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* Ephemeral H_s Entropy Waveform Timeline */}
            <div className="p-4 border border-gray-800 rounded-lg bg-gray-950/80">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-xs font-mono uppercase tracking-widest text-yellow-500">
                  Ephemeral Hₛ Entropy Waveform
                </h3>
                <span className="text-[10px] font-mono text-gray-400">
                  Measures structural complexity over session
                </span>
              </div>
              
              <div className="h-32 w-full bg-black/60 rounded border border-gray-900 p-2 relative flex items-end overflow-hidden">
                {stateHistory.length === 0 ? (
                  <div className="absolute inset-0 flex items-center justify-center text-xs font-mono text-gray-600">
                    [ Waveform dormant — Log state observations to plot trajectory ]
                  </div>
                ) : (
                  <svg className="w-full h-full overflow-visible" viewBox={`0 0 ${Math.max(100, stateHistory.length * 30)} 100`} preserveAspectRatio="none">
                    {/* Gridlines */}
                    <line x1="0" y1="25" x2="1000" y2="25" stroke="#1f2937" strokeDasharray="2 2" />
                    <line x1="0" y1="50" x2="1000" y2="50" stroke="#1f2937" strokeDasharray="2 2" />
                    <line x1="0" y1="75" x2="1000" y2="75" stroke="#1f2937" strokeDasharray="2 2" />
                    
                    {/* Polyline */}
                    {stateHistory.length > 1 && (
                      <polyline
                        fill="none"
                        stroke="#eab308"
                        strokeWidth="2"
                        points={stateHistory.map((s, idx) => {
                          const x = (idx / (stateHistory.length - 1)) * 100;
                          const y = 100 - (s.hs * 100);
                          return `${x}%,${y}`;
                        }).join(' ')}
                      />
                    )}

                    {/* Data Points */}
                    {stateHistory.map((s, idx) => {
                      const x = stateHistory.length === 1 ? 50 : (idx / (stateHistory.length - 1)) * 100;
                      const y = 100 - (s.hs * 100);
                      const isSelected = activeStateIndex === idx;
                      return (
                        <g key={s.id} onClick={() => setActiveStateIndex(idx)} className="cursor-pointer">
                          <circle
                            cx={`${x}%`}
                            cy={`${y}%`}
                            r={isSelected ? "6" : "4"}
                            className={`${isSelected ? 'fill-yellow-400 stroke-white' : 'fill-yellow-600 hover:fill-yellow-400'} transition-all`}
                          />
                        </g>
                      );
                    })}
                  </svg>
                )}
              </div>
            </div>

            {/* Shifting Temporal Venn Diagram */}
            <div className="p-6 border border-gray-800 rounded-lg bg-gray-950/80 relative overflow-hidden flex flex-col justify-center items-center min-h-[240px]">
              <h3 className="text-xs font-mono uppercase tracking-widest text-yellow-500 mb-4 z-10">
                Shifting Temporal Operator Intersection
              </h3>

              <div className="relative w-full max-w-lg h-44 flex items-center justify-center">
                <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, #fbbf24 0%, transparent 70%)' }}></div>
                
                {/* Source Circle */}
                <motion.div 
                  layout
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className="w-36 h-36 rounded-full border-2 border-blue-500/60 bg-blue-950/20 backdrop-blur-sm flex flex-col items-center justify-center p-2 text-center absolute left-1/4"
                >
                  <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest block font-bold mb-1">
                    {traditionA}
                  </span>
                  <span className="text-[9px] text-gray-400 line-clamp-2">
                    {comparisonResult?.source?.structure || ""}
                  </span>
                </motion.div>

                {/* Overlapping Shared Operators */}
                <motion.div 
                  layout
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  className="z-10 bg-black/90 px-5 py-3 rounded-xl border border-yellow-500/60 shadow-xl shadow-yellow-950/40 flex flex-col items-center text-center"
                >
                  <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-1">
                    Shared RS Operators
                  </span>
                  <span className="font-bold text-yellow-400 text-2xl font-serif tracking-widest">
                    {comparisonResult?.analysis?.shared_operators?.join(" ") || "∅"}
                  </span>
                </motion.div>

                {/* Target Circle */}
                <motion.div 
                  layout
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className="w-36 h-36 rounded-full border-2 border-red-500/60 bg-red-950/20 backdrop-blur-sm flex flex-col items-center justify-center p-2 text-center absolute right-1/4"
                >
                  <span className="text-[10px] font-mono text-red-400 uppercase tracking-widest block font-bold mb-1">
                    {traditionB}
                  </span>
                  <span className="text-[9px] text-gray-400 line-clamp-2">
                    {comparisonResult?.target?.structure || ""}
                  </span>
                </motion.div>
              </div>
            </div>

            {/* Live Concept Translation & Multi-Tradition Resonance Heatmap */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Concept Translation Pane */}
              <div className="p-4 border border-yellow-900/40 bg-yellow-950/10 rounded-lg">
                <h4 className="text-xs font-mono uppercase tracking-widest text-yellow-400 mb-2 border-b border-yellow-900/40 pb-2">
                  Concept Translation Narrative
                </h4>
                
                {comparisonResult?.concept_translation ? (
                  <div className="text-xs text-gray-300 space-y-2 animate-fade-in">
                    <p className="text-yellow-200/90 font-medium">
                      {comparisonResult.concept_translation.narrative}
                    </p>
                    <div className="text-[11px] text-gray-400 font-mono space-y-1">
                      <div><span className="text-gray-500">Source Projection:</span> {comparisonResult.concept_translation.source_projection}</div>
                      <div><span className="text-gray-500">Target Projection:</span> {comparisonResult.concept_translation.target_projection}</div>
                      <div><span className="text-gray-500">RS Operator:</span> {comparisonResult.concept_translation.rs_operator}</div>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 leading-relaxed font-mono">
                    {activeState ? comparisonResult?.analysis?.translation_path : "Log a state observation above to reveal live concept-level projection across lenses."}
                  </p>
                )}
              </div>

              {/* Multi-Tradition Resonance Heatmap */}
              <div className="p-4 border border-gray-800 bg-gray-950/80 rounded-lg">
                <h4 className="text-xs font-mono uppercase tracking-widest text-yellow-500 mb-2 border-b border-gray-800 pb-2">
                  Multi-Tradition Resonance Heatmap
                </h4>
                
                <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                  {ALL_TRADITIONS.slice(0, 6).map((trad) => {
                    const isSource = trad === traditionA;
                    const isTarget = trad === traditionB;
                    const isResonating = activeState && (isSource || isTarget || Math.random() > 0.4);

                    return (
                      <div 
                        key={trad} 
                        className={`p-2 rounded border flex justify-between items-center transition-all ${
                          isResonating 
                            ? 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300' 
                            : 'border-gray-800 bg-black/40 text-gray-500'
                        }`}
                      >
                        <span className="truncate mr-1">{trad.split(' ')[0]}</span>
                        <span className={`text-[9px] px-1 rounded ${isResonating ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-800 text-gray-600'}`}>
                          {isResonating ? 'ACTIVE' : 'IDLE'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Epistemological Differences & Synthesis */}
            {comparisonResult && (
              <div className="p-4 border border-gray-800 bg-black/60 rounded-lg text-xs font-mono text-gray-300 space-y-2">
                <div>
                  <span className="text-gray-500 block uppercase tracking-wider text-[10px]">Epistemological Difference</span>
                  {comparisonResult.analysis.epistemological_differences}
                </div>
                <div>
                  <span className="text-gray-500 block uppercase tracking-wider text-[10px]">Synthesis Strategy</span>
                  {comparisonResult.analysis.integration_strategy}
                </div>
              </div>
            )}

          </div>

        </div>
      </div>
    </main>
  );
}
