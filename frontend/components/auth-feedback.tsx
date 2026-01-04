"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, AlertCircle, X } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type ToastProps = {
  message: string;
  type: "success" | "error";
  onClose: () => void;
};

export function AuthFeedback({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={cn(
        "fixed bottom-4 right-4 z-50 flex items-center gap-3 rounded-lg p-4 shadow-lg animate-in fade-in slide-in-from-bottom-5",
        type === "success" ? "bg-green-50 text-green-800 border border-green-200" : "bg-red-50 text-red-800 border border-red-200"
      )}
    >
      {type === "success" ? (
        <CheckCircle2 className="h-5 w-5 text-green-500" />
      ) : (
        <AlertCircle className="h-5 w-5 text-red-500" />
      )}
      <p className="text-sm font-medium">{message}</p>
      <button
        onClick={onClose}
        className="ml-auto rounded-md p-1 hover:bg-black/5 transition-colors"
      >
        <X className="h-4 w-4 opacity-50" />
      </button>
    </div>
  );
}
