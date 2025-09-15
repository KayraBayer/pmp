import React from "react";

export default function SectionCard({ title, children, grow }: { title: string; children: React.ReactNode; grow?: boolean }) {
  return (
    <div className={`rounded-2xl bg-slate-900/60 ring-1 ring-slate-800 ${grow ? "flex flex-col" : ""}`}>
      <div className="px-4 sm:px-6 pt-4 pb-2 text-slate-200 font-semibold flex items-center gap-3">
        <div className="h-2 w-2 rounded-full bg-indigo-500 shadow-[0_0_10px_#6366f1]"></div>
        {title}
      </div>
      <div className="px-4 sm:px-6 pb-4">{children}</div>
    </div>
  );
}