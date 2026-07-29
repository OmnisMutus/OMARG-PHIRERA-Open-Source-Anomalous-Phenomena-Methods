"use client";

import HeaderAuditDashboard from "../../components/HeaderAuditDashboard";
import PrivacySeal from "../../components/PrivacySeal";

export default function AuditDashboardPage() {
  const badgeUrl = "https://github.com/OmnisMutus/OMARG-PHIRERA-Open-Source-Anomalous-Phenomena-Methods/actions/workflows/header-audit.yml/badge.svg";

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 lg:p-12 relative z-10 bg-black text-gray-100 font-sans">
      <div className="w-full max-w-3xl glass-container flex flex-col items-center">
        
        <header className="mb-6 text-center border-b border-gray-800 pb-4 w-full">
          <h1 className="title text-3xl font-bold tracking-wider">SECURITY HEADER AUDIT</h1>
          <p className="subtitle text-sm text-yellow-500/80 font-mono mt-1">Real-time Privacy Verification & CI Pipeline Health</p>
          <a href="/" className="text-xs text-gray-400 hover:text-yellow-400 font-mono mt-2 inline-block">← Return to Observatory</a>
        </header>

        <PrivacySeal />

        <div className="my-6 w-full flex justify-center">
          <HeaderAuditDashboard 
            badgeUrl={badgeUrl} 
            workflowName="Security Header & Privacy Audit"
          />
        </div>

        <div className="w-full p-4 border border-gray-800 rounded bg-gray-950/80 text-xs font-mono text-gray-400 space-y-2">
          <h4 className="text-yellow-500 uppercase tracking-widest font-bold">Auditor Quick-Start Verification</h4>
          <ol className="list-decimal list-inside space-y-1 text-gray-300">
            <li>Verify CI Badge reads <strong className="text-emerald-400">PASSING</strong>.</li>
            <li>Confirm HTTP responses serve <code className="text-yellow-400">Content-Security-Policy: default-src 'self'</code>.</li>
            <li>Confirm HTTP responses serve <code className="text-yellow-400">Cache-Control: no-store, no-cache</code>.</li>
            <li>Run <code className="text-yellow-400">npm run test</code> locally to verify Isomorphism & Defensive Headers.</li>
          </ol>
        </div>

      </div>
    </main>
  );
}
