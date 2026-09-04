"use client";
import { useState } from "react";
import GoForTwo from "@/components/GoForTwo";
import ClockManager from "@/components/ClockManager";

export default function Home() {
  const [tab, setTab] = useState<"go2" | "clock">("go2");

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-md mx-auto px-4 pt-6 pb-24">
        <h1 className="text-2xl font-bold text-center mb-1">Game Day Decisions</h1>
        <p className="text-center text-slate-400 text-sm mb-6">NCAA rules built in</p>

        <div className="flex rounded-xl bg-slate-900 p-1 mb-6">
          <button
            onClick={() => setTab("go2")}
            className={`flex-1 rounded-lg py-2 text-sm font-semibold transition ${
              tab === "go2" ? "bg-blue-600 text-white" : "text-slate-400"
            }`}
          >
            Go for 2
          </button>
          <button
            onClick={() => setTab("clock")}
            className={`flex-1 rounded-lg py-2 text-sm font-semibold transition ${
              tab === "clock" ? "bg-blue-600 text-white" : "text-slate-400"
            }`}
          >
            Clock / Timeouts
          </button>
        </div>

        {tab === "go2" ? <GoForTwo /> : <ClockManager />}
      </div>
    </main>
  );
}
