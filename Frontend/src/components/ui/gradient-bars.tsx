"use client";

import { cn } from "@/lib/utils";

export function GradientBars({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "absolute inset-0 pointer-events-none overflow-hidden",
        className
      )}
    >
      {/* Very subtle gradient bars */}
      <div className="absolute inset-0">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className={cn(
              "absolute h-full opacity-5",
              "bg-gradient-to-b from-primary/10 via-primary/3 to-transparent",
              "animate-pulse"
            )}
            style={{
              width: `${1 + i * 0.2}px`,
              left: `${20 + i * 20}%`,
              animationDelay: `${i * 0.8}s`,
              animationDuration: `${5 + i * 0.5}s`,
            }}
          />
        ))}

        {/* Minimal floating elements */}
        {[...Array(2)].map((_, i) => (
          <div
            key={`float-${i}`}
            className={cn(
              "absolute h-16 opacity-3",
              "bg-gradient-to-r from-transparent via-primary/5 to-transparent",
              "animate-[subtleFloat_8s_ease-in-out_infinite]"
            )}
            style={{
              width: `${10 + i * 5}px`,
              left: `${30 + i * 30}%`,
              top: `${30 + i * 20}%`,
              animationDelay: `${i * 2}s`,
            }}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes subtleFloat {
          0%,
          100% {
            transform: translateY(0px);
            opacity: 0.02;
          }
          50% {
            transform: translateY(-5px);
            opacity: 0.05;
          }
        }
      `}</style>
    </div>
  );
}
