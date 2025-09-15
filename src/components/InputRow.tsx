import type { FieldDef } from "../types";

export default function InputRow({ def, value, onChange }: { def: FieldDef; value: string; onChange: (v: string) => void; }) {
  return (
    <label className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-2 items-center py-1">
      <div className="text-slate-300 text-sm">{def.label}</div>
      <div className="flex items-center gap-2">
        <input
          className="w-full rounded-xl bg-slate-800/80 px-3 py-2 text-slate-100 outline-none ring-1 ring-slate-700 focus:ring-2 focus:ring-indigo-500"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={def.placeholder}
          inputMode={def.inputMode}
        />
        {def.unit ? <span className="min-w-14 text-right text-slate-400 text-xs">{def.unit}</span> : null}
      </div>
    </label>
  );
}