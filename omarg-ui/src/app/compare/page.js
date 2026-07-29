"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function ComparePage() {
  const [mappings, setMappings] = useState({});
  const [traditionA, setTraditionA] = useState('');
  const [traditionB, setTraditionB] = useState('');
  const [comparisonResult, setComparisonResult] = useState(null);
  
  // Custom Ontology Upload
  const [customOntologyInput, setCustomOntologyInput] = useState('');
  const [uploadError, setUploadError] = useState('');

  useEffect(() => {
    // Fetch base mappings
    fetch('/mappings/cross_tradition_mappings.json')
      .then(res => res.json())
      .then(data => {
        setMappings(data.cross_tradition_mappings);
        const keys = Object.keys(data.cross_tradition_mappings);
        if (keys.length >= 2) {
          setTraditionA(keys[0]);
          setTraditionB(keys[1]);
        }
      })
      .catch(err => console.error("Failed to load mappings", err));
  }, []);

  const handleCompare = async () => {
    if (!traditionA || !traditionB) return;
    
    // Check if we need to manually construct the comparison for custom uploaded ones
    // But our API endpoint handles it if we send it the payload. Wait, the API endpoint reads from file.
    // We should modify the comparison logic to run client-side if we have custom mappings in state.
    
    const sourceData = mappings[traditionA];
    const targetData = mappings[traditionB];

    const sourceOps = sourceData.corresponding_operators || [];
    const targetOps = targetData.corresponding_operators || [];
    const sharedOps = sourceOps.filter(op => targetOps.includes(op));

    let translationPath = "";
    if (sharedOps.length > 0) {
      translationPath = `To translate ${traditionA} → ${traditionB}, pivot around shared operator(s) [${sharedOps.join(", ")}]. Map ${sourceData.structural_pattern} to ${targetData.structural_pattern}.`;
    } else {
      translationPath = `No direct shared operators found. To translate, a higher-order transformation from [${sourceOps.join(", ")}] to [${targetOps.join(", ")}] is required.`;
    }

    setComparisonResult({
      source: {
        name: traditionA,
        ...sourceData
      },
      target: {
        name: traditionB,
        ...targetData
      },
      analysis: {
        shared_operators: sharedOps,
        epistemological_differences: `${traditionA} frames this as '${sourceData.structural_pattern}'; ${traditionB} frames it as '${targetData.structural_pattern}'.`,
        translation_path: translationPath,
        integration_strategy: `Combine ${traditionA}'s ${sourceData.structure_type} with ${traditionB}'s ${targetData.structure_type} to create a ${sharedOps.length > 0 ? "synthesized" : "orthogonal"} model.`
      }
    });
  };

  const handleUpload = async () => {
    try {
      setUploadError('');
      const parsed = JSON.parse(customOntologyInput);
      
      const res = await fetch('/api/validate-ontology', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed)
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Validation failed');
      
      // Add to local mappings
      setMappings(prev => ({ ...prev, ...data.ontology }));
      setCustomOntologyInput('');
      alert("Custom ontology loaded successfully. You can now select it for comparison.");
      
    } catch (err) {
      setUploadError(err.message);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-8 lg:p-24 relative z-10 overflow-auto">
      <div className="w-full max-w-6xl glass-container">
        <header className="mb-8 text-center border-b border-gray-700 pb-4">
          <h1 className="title text-3xl">Meta-Cartography</h1>
          <p className="subtitle">Cross-Tradition Translation Engine</p>
          <a href="/" className="text-yellow-500 hover:text-yellow-400 text-xs mt-2 inline-block">← Return to the Mirror</a>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Controls */}
          <div className="flex flex-col gap-6">
            <div className="p-4 border border-gray-700 rounded-lg bg-black/40">
              <h2 className="text-lg text-yellow-500 font-mono mb-4">Select Traditions</h2>
              
              <label className="block text-xs text-gray-400 mb-1">Tradition A (Source)</label>
              <select 
                className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-sm text-gray-200 mb-4"
                value={traditionA}
                onChange={(e) => setTraditionA(e.target.value)}
              >
                {Object.keys(mappings).map(k => <option key={k} value={k}>{k}</option>)}
              </select>

              <label className="block text-xs text-gray-400 mb-1">Tradition B (Target)</label>
              <select 
                className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-sm text-gray-200 mb-6"
                value={traditionB}
                onChange={(e) => setTraditionB(e.target.value)}
              >
                {Object.keys(mappings).map(k => <option key={k} value={k}>{k}</option>)}
              </select>

              <button className="btn w-full text-sm py-2" onClick={handleCompare}>Run Comparison</button>
            </div>

            <div className="p-4 border border-gray-700 rounded-lg bg-black/40">
              <h2 className="text-lg text-yellow-500 font-mono mb-2">Upload Ontology</h2>
              <p className="text-xs text-gray-400 mb-4 leading-relaxed">
                Inject your own personal cosmology to compare against established traditions.
              </p>
              <textarea 
                className="w-full h-32 bg-gray-900 border border-gray-700 rounded p-2 text-xs font-mono text-gray-300 mb-2"
                placeholder='{"name": "MyTradition", "mapping": {...}}'
                value={customOntologyInput}
                onChange={(e) => setCustomOntologyInput(e.target.value)}
              />
              {uploadError && <p className="text-red-400 text-xs mb-2">{uploadError}</p>}
              <button className="btn w-full text-sm py-1 border-gray-600 hover:border-yellow-500" onClick={handleUpload}>Validate & Load</button>
            </div>
          </div>

          {/* Results Display */}
          <div className="lg:col-span-2">
            {!comparisonResult ? (
              <div className="h-full flex items-center justify-center border border-dashed border-gray-700 rounded-lg p-12 text-gray-500 font-mono text-sm">
                Awaiting comparison...
              </div>
            ) : (
              <div className="flex flex-col gap-6 animate-fade-in">
                
                {/* Visual Venn / Intersection */}
                <div className="p-6 border border-gray-700 rounded-lg bg-black/60 relative overflow-hidden flex justify-center items-center h-48">
                  <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, #fbbf24 0%, transparent 70%)' }}></div>
                  
                  {/* Circle A */}
                  <motion.div 
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 20, opacity: 1 }}
                    className="w-32 h-32 rounded-full border-2 border-blue-500/50 flex items-center justify-center text-xs font-mono text-blue-400 absolute left-1/4"
                  >
                    {comparisonResult.source.name}
                  </motion.div>

                  {/* Shared Operators */}
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="z-10 bg-black/80 px-4 py-2 rounded-lg border border-yellow-500/50 flex flex-col items-center"
                  >
                    <span className="text-xs text-gray-400 mb-1">Shared RS Operators</span>
                    <span className="font-bold text-yellow-500 text-xl font-serif">
                      {comparisonResult.analysis.shared_operators.join(" ") || "∅"}
                    </span>
                  </motion.div>

                  {/* Circle B */}
                  <motion.div 
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: -20, opacity: 1 }}
                    className="w-32 h-32 rounded-full border-2 border-red-500/50 flex items-center justify-center text-xs font-mono text-red-400 absolute right-1/4"
                  >
                    {comparisonResult.target.name}
                  </motion.div>
                </div>

                {/* Textual Breakdown */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border border-blue-900/50 bg-blue-900/10 rounded">
                    <h3 className="text-blue-400 font-bold mb-2">{comparisonResult.source.name}</h3>
                    <p className="text-xs text-gray-300 mb-2"><span className="text-gray-500">Structure:</span> {comparisonResult.source.structure_type}</p>
                    <p className="text-xs text-gray-300 mb-2"><span className="text-gray-500">Pattern:</span> {comparisonResult.source.structural_pattern}</p>
                    <p className="text-xs text-gray-300"><span className="text-gray-500">Core Concept:</span> {comparisonResult.source.core_concept}</p>
                  </div>
                  <div className="p-4 border border-red-900/50 bg-red-900/10 rounded">
                    <h3 className="text-red-400 font-bold mb-2">{comparisonResult.target.name}</h3>
                    <p className="text-xs text-gray-300 mb-2"><span className="text-gray-500">Structure:</span> {comparisonResult.target.structure_type}</p>
                    <p className="text-xs text-gray-300 mb-2"><span className="text-gray-500">Pattern:</span> {comparisonResult.target.structural_pattern}</p>
                    <p className="text-xs text-gray-300"><span className="text-gray-500">Core Concept:</span> {comparisonResult.target.core_concept}</p>
                  </div>
                </div>

                {/* Meta-Analysis */}
                <div className="p-4 border border-yellow-900/50 bg-yellow-900/10 rounded">
                  <h3 className="text-yellow-500 font-mono mb-4 text-sm uppercase tracking-widest border-b border-yellow-900/50 pb-2">Epistemological Translation</h3>
                  
                  <div className="mb-4">
                    <h4 className="text-xs text-gray-500 uppercase tracking-wider mb-1">Structural Difference</h4>
                    <p className="text-sm text-gray-300">{comparisonResult.analysis.epistemological_differences}</p>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="text-xs text-gray-500 uppercase tracking-wider mb-1">Translation Path</h4>
                    <p className="text-sm text-gray-300">{comparisonResult.analysis.translation_path}</p>
                  </div>

                  <div>
                    <h4 className="text-xs text-gray-500 uppercase tracking-wider mb-1">Integration Strategy</h4>
                    <p className="text-sm text-gray-300">{comparisonResult.analysis.integration_strategy}</p>
                  </div>
                </div>

              </div>
            )}
          </div>

        </div>
      </div>
    </main>
  );
}
