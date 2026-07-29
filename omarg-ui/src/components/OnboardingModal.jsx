"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function OnboardingModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);

  useEffect(() => {
    // Check if first time visiting
    const hasSeenOnboarding = localStorage.getItem('omarg_onboarding_seen');
    if (!hasSeenOnboarding) {
      setIsOpen(true);
    }
  }, []);

  const closeOnboarding = () => {
    localStorage.setItem('omarg_onboarding_seen', 'true');
    setIsOpen(false);
  };

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
    else closeOnboarding();
  };

  return (
    <>
      {/* Re-open button in header / footer */}
      <button
        onClick={() => setIsOpen(true)}
        className="text-[11px] font-mono text-yellow-500/80 hover:text-yellow-400 border border-yellow-500/30 px-2.5 py-1 rounded bg-yellow-500/10 transition-colors flex items-center gap-1.5"
      >
        <span>✨</span> Quick Guide
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-lg bg-gray-950 border border-yellow-500/40 rounded-2xl p-6 shadow-2xl space-y-6 text-gray-200 font-sans relative overflow-hidden"
            >
              {/* Top Step Counter */}
              <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                <span className="text-xs font-mono text-yellow-400 uppercase tracking-widest font-bold">
                  Welcome to OMARG Observatory ({step} / 3)
                </span>
                <button
                  onClick={closeOnboarding}
                  className="text-xs font-mono text-gray-500 hover:text-white"
                >
                  ✕ Skip
                </button>
              </div>

              {/* Step Content */}
              <div className="min-h-[160px] flex flex-col justify-center space-y-3">
                {step === 1 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
                    <div className="text-2xl font-bold text-white flex items-center gap-2">
                      <span>1. State Injection</span>
                    </div>
                    <p className="text-xs text-gray-300 leading-relaxed">
                      Type your current psychological or energetic state into the input deck (or select a preset sample). 
                      The engine treats your words not as static text, but as an <strong>executable state transition code</strong>.
                    </p>
                    <div className="p-3 bg-black/60 border border-gray-800 rounded-lg text-xs font-mono text-yellow-300">
                      Formula: Sₙ₊₁ = F(Sₙ, Eₙ)
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
                    <div className="text-2xl font-bold text-white flex items-center gap-2">
                      <span>2. Tohu & Diagnosis</span>
                    </div>
                    <p className="text-xs text-gray-300 leading-relaxed">
                      Your input is deterministically scrambled into a chaotic integer array (<strong>Tohu</strong>) and scanned for dominant Qabbalistic keyword resonances (<strong>Geburah, Hod, Chokmah, Tiphareth</strong>).
                    </p>
                    <div className="p-3 bg-black/60 border border-gray-800 rounded-lg text-xs font-mono text-emerald-400">
                      Entropy Hₛ measures structural complexity in real time.
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
                    <div className="text-2xl font-bold text-white flex items-center gap-2">
                      <span>3. Tikun Sorting Ritual</span>
                    </div>
                    <p className="text-xs text-gray-300 leading-relaxed">
                      Watch the corresponding sorting algorithm execute step-by-step in the visual arena to restore structural harmony (<strong>Tikun</strong>), complete with audio pulse feedback.
                    </p>
                    <div className="p-3 bg-black/60 border border-yellow-500/30 rounded-lg text-xs font-mono text-yellow-200">
                      Zero-Trust Privacy: 100% of data processing stays in your local browser memory.
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Step Navigation Bar */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-800">
                <div className="flex gap-1.5">
                  {[1, 2, 3].map((s) => (
                    <div
                      key={s}
                      className={`w-2.5 h-2.5 rounded-full transition-all ${
                        step === s ? 'bg-yellow-400 scale-125' : 'bg-gray-800'
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={nextStep}
                  className="px-5 py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-mono font-bold text-xs uppercase tracking-widest rounded-lg transition-all shadow-lg shadow-yellow-500/20"
                >
                  {step === 3 ? "Enter Observatory" : "Next →"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
