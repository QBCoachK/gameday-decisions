"use client";
import { useState } from "react";
import { goForTwoAdvice } from "@/lib/rules";

export default function GoForTwo() {
  const [margin, setMargin] = useState(-2);
  const [quarter, setQuarter] = useState<1 | 2 | 3 | 4 | 5>(4);
  const [seconds, setSeconds] = useState(120);
  const result = goForTwoAdvice({
    margin,
    quarter,
    secondsRemaining: seconds,
    possessionAfterScore: "unsure",
  });

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">
          Score margin before extra point (you − opponent)
        </label>
        <input
          type="number"
          value={margin}
          onChange={(e) => setMargin(Number(e.target.value))}
          className="w-full rounded-lg bg-slate-800 border border-slate-600 px-4 py-3 text-lg text-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Quarter</label>
        <div className="grid grid-cols-5 gap-2">
          {[1, 2, 3, 4, 5].map((q) => (
            <button
              key={q}
              onClick={() => setQuarter(q as 1 | 2 | 3 | 4 | 5)}
              className={`rounded-lg py-2 text-sm font-semibold ${
                quarter === q ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-300"
              }`}
            >
              {q === 5 ? "OT" : `Q${q}`}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">
          Seconds remaining in period: {seconds}
        </label>
        <input
          type="range"
          min={0}
          max={900}
          value={seconds}
          onChange={(e) => setSeconds(Number(e.target.value))}
          className="w-full"
        />
      </div>

      <div className="rounded-xl bg-slate-800 border border-blue-500 p-4">
        <div className="text-2xl font-bold text-blue-400">{result.recommendation}</div>
        <ul className="mt-3 space-y-2 text-sm text-slate-300 list-disc list-inside">
          {result.reasoning.map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
