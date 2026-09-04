"use client";
import { useState } from "react";
import { clockAdvice } from "@/lib/rules";

export default function ClockManager() {
  const [yourTO, setYourTO] = useState<0 | 1 | 2 | 3>(2);
  const [oppTO, setOppTO] = useState<0 | 1 | 2 | 3>(1);
  const [seconds, setSeconds] = useState(140);
  const [down, setDown] = useState<1 | 2 | 3 | 4>(1);
  const [havePossession, setHavePossession] = useState(true);
  const [needFirstDown, setNeedFirstDown] = useState(false);

  const result = clockAdvice({
    yourTimeouts: yourTO,
    opponentTimeouts: oppTO,
    secondsRemaining: seconds,
    down,
    havePossession,
    needFirstDown,
  });

  const TOButtons = ({
    value,
    onChange,
  }: {
    value: number;
    onChange: (v: 0 | 1 | 2 | 3) => void;
  }) => (
    <div className="grid grid-cols-4 gap-2">
      {[0, 1, 2, 3].map((n) => (
        <button
          key={n}
          onClick={() => onChange(n as 0 | 1 | 2 | 3)}
          className={`rounded-lg py-2 text-sm font-semibold ${
            value === n ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-300"
          }`}
        >
          {n}
        </button>
      ))}
    </div>
  );

  return (
    <div className="space-y-5">
      <div className="flex gap-3">
        <button
          onClick={() => setHavePossession(true)}
          className={`flex-1 rounded-lg py-2 font-semibold ${
            havePossession ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-300"
          }`}
        >
          We have the ball
        </button>
        <button
          onClick={() => setHavePossession(false)}
          className={`flex-1 rounded-lg py-2 font-semibold ${
            !havePossession ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-300"
          }`}
        >
          They have the ball
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Your timeouts</label>
        <TOButtons value={yourTO} onChange={setYourTO} />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Opponent timeouts</label>
        <TOButtons value={oppTO} onChange={setOppTO} />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">
          Seconds remaining: {seconds}
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

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Down</label>
        <div className="grid grid-cols-4 gap-2">
          {[1, 2, 3, 4].map((d) => (
            <button
              key={d}
              onClick={() => setDown(d as 1 | 2 | 3 | 4)}
              className={`rounded-lg py-2 text-sm font-semibold ${
                down === d ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-300"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {havePossession && (
        <label className="flex items-center gap-2 text-sm text-slate-300">
          <input
            type="checkbox"
            checked={needFirstDown}
            onChange={(e) => setNeedFirstDown(e.target.checked)}
          />
          Just protecting the lead (don't need to convert to win)
        </label>
      )}

      <div className="rounded-xl bg-slate-800 border border-blue-500 p-4">
        <div className="text-xl font-bold text-blue-400">{result.headline}</div>
        <ul className="mt-3 space-y-2 text-sm text-slate-300 list-disc list-inside">
          {result.details.map((d, i) => (
            <li key={i}>{d}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
