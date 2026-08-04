"use client";

import { Printer } from "lucide-react";

export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="prose-link inline-flex items-center gap-1.5 text-[14px]"
    >
      <Printer size={14} className="opacity-60" />
      Save as PDF
    </button>
  );
}
