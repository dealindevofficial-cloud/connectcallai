"use client";

import { Toaster } from "sonner";

/**
 * Global toast host — use `import { toast } from "sonner"` in client components.
 */
export function AppToaster() {
  return (
    <Toaster
      theme="light"
      position="top-right"
      closeButton
      richColors
      expand
      offset={{ top: "5.5rem", right: "1rem" }}
      duration={8000}
      toastOptions={{
        classNames: {
          toast:
            "group !border !border-[#b9c5ff] !bg-[#eef2ff] !text-[#0f172a] shadow-[0_16px_44px_rgba(15,23,70,0.35)] backdrop-blur-sm",
          title: "!text-[#0f172a]",
          description: "!text-[#475569]",
          success:
            "!border-emerald-300 !bg-emerald-50 !text-emerald-950 [&_[data-icon]]:!text-emerald-600",
          error: "!border-red-300 !bg-red-50 !text-red-950 [&_[data-icon]]:!text-red-600",
          loading:
            "!border-[#93a4ff] !bg-[#f4f6ff] !text-[#1e1b4b] [&_.loader]:!text-[#4f46e5]",
        },
      }}
    />
  );
}
