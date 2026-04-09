"use client";

import { useState, useRef, useEffect } from "react";

interface CoachingHoverProps {
  tip: string;
  sopRef?: string;
  severity?: "info" | "critical" | "flag";
  children: React.ReactNode;
}

export default function CoachingHover({
  tip,
  sopRef,
  severity = "info",
  children,
}: CoachingHoverProps) {
  const [show, setShow] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!show) return;
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setShow(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [show]);

  const borderColor =
    severity === "critical" ? "border-red-400" :
    severity === "flag" ? "border-amber-400" :
    "border-blue-300";

  const bgColor =
    severity === "critical" ? "bg-red-50" :
    severity === "flag" ? "bg-amber-50" :
    "bg-blue-50";

  const icon =
    severity === "critical" ? "🔴" :
    severity === "flag" ? "🟡" :
    "ℹ️";

  return (
    <div ref={ref} className="relative inline-block">
      <div
        onMouseEnter={() => setShow(true)}
        onClick={() => setShow(!show)}
        className="cursor-help"
      >
        {children}
      </div>
      {show && (
        <div
          className={`absolute z-50 left-0 top-full mt-1 w-80 ${bgColor} border ${borderColor} rounded-lg shadow-lg p-3 text-xs leading-relaxed`}
          onMouseLeave={() => setShow(false)}
        >
          <div className="flex items-start gap-2">
            <span className="flex-shrink-0 text-sm">{icon}</span>
            <div>
              <p className="text-gray-800">{tip}</p>
              {sopRef && (
                <p className="mt-1 text-gray-500 font-mono text-[10px]">
                  Ref: {sopRef}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
