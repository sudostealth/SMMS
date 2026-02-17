"use client";

import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";

interface LoginSuccessAnimationProps {
  onComplete?: () => void;
}

export default function LoginSuccessAnimation({ onComplete }: LoginSuccessAnimationProps) {
  const [stage, setStage] = useState<"loading" | "success" | "complete">("loading");

  useEffect(() => {
    // Show loading for 800ms
    const loadingTimer = setTimeout(() => {
      setStage("success");
    }, 800);

    // Show success checkmark for 1200ms
    const successTimer = setTimeout(() => {
      setStage("complete");
      onComplete?.();
    }, 2000);

    return () => {
      clearTimeout(loadingTimer);
      clearTimeout(successTimer);
    };
  }, [onComplete]);

  if (stage === "complete") return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative">
        {stage === "loading" && (
          <div className="flex flex-col items-center gap-4">
            {/* Spinning loader */}
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 rounded-full border-4 border-gray-200 dark:border-gray-700"></div>
              <div className="absolute inset-0 rounded-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
            </div>
            <p className="text-white font-medium animate-pulse">Logging in...</p>
          </div>
        )}

        {stage === "success" && (
          <div className="flex flex-col items-center gap-4 animate-in zoom-in duration-300">
            {/* Success checkmark with animation */}
            <div className="relative">
              {/* Outer circle with expand animation */}
              <div className="absolute inset-0 w-24 h-24 bg-green-500/20 rounded-full animate-ping"></div>
              
              {/* Main circle */}
              <div className="relative w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/50">
                {/* Checkmark with draw animation */}
                <CheckCircle2 className="w-14 h-14 text-white animate-in zoom-in duration-500" strokeWidth={3} />
              </div>
            </div>
            
            <p className="text-white font-medium animate-in fade-in slide-in-from-bottom-3 duration-500">
              Login Successful!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
