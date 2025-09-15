export default function ValueRow({ label, unit, value, fmt }: {
  label: string; unit?: string; value: number; fmt?: (n: number) => string;
}) {
  const s = fmt ? fmt(value) : value.toLocaleString("tr-TR");
  return (
    <div className="grid grid-cols-[1fr_auto] items-center py-1">
      <span className="text-slate-300 text-sm">{label}</span>
      <span className="justify-self-end rounded-md bg-slate-900 px-2 py-1 text-slate-100 text-sm ring-1 ring-slate-800">
        {s} {unit ? <span className="text-slate-400">{unit}</span> : null}
      </span>
    </div>
  );
}