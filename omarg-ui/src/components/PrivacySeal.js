"use client";

import { motion } from 'framer-motion';

export default function PrivacySeal() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full mb-6 p-4 rounded-lg border border-emerald-500/40 bg-emerald-950/20 text-emerald-300 flex items-start gap-3 shadow-lg shadow-emerald-950/30"
    >
      <div className="text-xl shrink-0 mt-0.5">🛡️</div>
      <div className="flex-1 text-xs leading-relaxed">
        <strong className="text-emerald-400 font-mono uppercase tracking-wider block mb-1">
          Ironclad Privacy Guarantee (Ephemeral Only)
        </strong>
        "Your psychological data exists only in your browser's memory. Close this tab, and it vanishes forever. We believe consciousness should be observed, not recorded."
      </div>
    </motion.div>
  );
}
