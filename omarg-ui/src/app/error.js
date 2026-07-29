"use client";

import { useEffect } from "react";

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log sanitized error message without exposing local system paths
    const sanitizedMessage = (error?.message || "An unexpected error occurred").replace(/file:\/\/\/[A-Za-z]:\/[^\s]*/g, '[redacted_path]');
    console.error("Application Error:", sanitizedMessage);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-black text-gray-100 font-sans text-center">
      <div className="glass-container max-w-md p-8 border border-red-500/30 rounded-lg bg-red-950/20">
        <h2 className="text-xl font-mono font-bold text-red-400 mb-4 uppercase tracking-widest">
          Observatory Anomaly Detected
        </h2>
        <p className="text-sm text-gray-300 mb-6 font-mono">
          {error?.message ? error.message.replace(/file:\/\/\/[A-Za-z]:\/[^\s]*/g, '[redacted_path]') : "State alignment error."}
        </p>
        <button
          onClick={() => reset()}
          className="btn bg-red-600 hover:bg-red-500 text-white font-mono px-6 py-2 rounded text-xs uppercase tracking-wider"
        >
          Reset Alignment
        </button>
      </div>
    </div>
  );
}
