import React, { useEffect, useMemo, useState } from "react";
import { DEFAULTS, GROUPS } from "./config/fields";
import { compute } from "./utils/compute";
import type { Inputs, Results } from "./types";
import { loadLast, saveLast } from "./hooks/usePresets";
import SectionCard from "./components/SectionCard";
import InputRow from "./components/InputRow";
import ValueRow from "./components/ValueRow";
import FileBar from "./components/FileBar";

export default function App() {
  const [inputs, setInputs] = useState<Inputs>(() => loadLast() ?? { ...DEFAULTS });
  const [results, setResults] = useState<Results | null>(null);
  const [tab, setTab] = useState<"inputs" | "results">("inputs"); // mobile tab

  useEffect(() => {
    const r = compute(inputs); setResults(r); saveLast(inputs);
  }, [inputs]);

  const regimeBadge = useMemo(() => {
    if (!results) return "bg-slate-800 text-slate-300";
    return results.rejim === "Laminer" ? "bg-emerald-900/40 text-emerald-200" : results.rejim === "Geçiş" ? "bg-amber-900/40 text-amber-200" : "bg-sky-900/40 text-sky-200";
  }, [results]);

  function temizle() { setInputs({ debi_lph: "", yog: "", viz_cp: "", cap_mm: "", pur_mm: "", uzun_m: "", kot_m: "", harici_bar: "", dirsek_ld: "", vana_ld: "", parca_m: "" }); }
  function varsayilan() { setInputs({ ...DEFAULTS }); }

  return (
    <div className="min-h-dvh bg-[radial-gradient(1200px_800px_at_80%_-20%,#1f2937_0%,#0b1220_60%)] text-slate-100">
      {/* Üst Bar */}
      <header className="sticky top-0 z-20 border-b border-slate-800/60 bg-slate-950/70 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-3 flex flex-wrap items-center gap-3">
          <div className="text-lg font-semibold">Boru Basınç Düşümü – Modern Hesaplayıcı</div>
          {results && (
            <span className={`ml-1 rounded-full px-3 py-1 text-sm ring-1 ring-white/10 ${regimeBadge}`}>Akış rejimi: {results.rejim}</span>
          )}
          <nav className="ml-auto flex items-center gap-2 lg:hidden">
            <button onClick={() => setTab("inputs")} className={`px-3 py-1.5 rounded-full text-sm ring-1 ${tab==="inputs"?"bg-indigo-600 text-white ring-indigo-600":"bg-slate-800 ring-slate-700"}`}>Girdiler</button>
            <button onClick={() => setTab("results")} className={`px-3 py-1.5 rounded-full text-sm ring-1 ${tab==="results"?"bg-indigo-600 text-white ring-indigo-600":"bg-slate-800 ring-slate-700"}`}>Sonuçlar</button>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl p-4 sm:p-6 space-y-4">
        {/* Dosya Barı */}
        <FileBar inputs={inputs} setInputs={setInputs} results={results} />

        {/* Rapor Kapsayıcı — PDF bu alanı yakalar */}
        <div id="report-root" className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Sol: Girdiler */}
          <div className={`${tab === "inputs" ? "block" : "hidden"} lg:block space-y-4`}>
            {GROUPS.map((g) => (
              <SectionCard key={g.title} title={g.title}>
                <div className="grid gap-2">
                  {g.fields.map((f) => (
                    <InputRow key={String(f.key)} def={f} value={inputs[f.key]} onChange={(v) => setInputs({ ...inputs, [f.key]: v }) as any} />
                  ))}
                </div>
              </SectionCard>
            ))}

            <div className="flex gap-2">
              <button className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 ring-1 ring-slate-700" onClick={temizle}>Temizle</button>
              <button className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 ring-1 ring-slate-700" onClick={varsayilan}>Varsayılanları Yükle</button>
            </div>
          </div>

          {/* Sağ: Sonuçlar */}
          <div className={`${tab === "results" ? "block" : "hidden"} lg:block space-y-4`}>
            <SectionCard title="Özet ve Türetilen Büyüklükler" grow>
              {results ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
                  <ValueRow label="Reynolds sayısı" unit="[-]" value={results.Re} fmt={(n) => Math.round(n).toLocaleString("tr-TR")} />
                  <ValueRow label="Ortalama akış hızı v" unit="[m/s]" value={results.v_ms} fmt={(n) => n.toFixed(3)} />
                  <ValueRow label="Sürtünme katsayısı f" unit="[-]" value={results.f} fmt={(n) => n.toFixed(4)} />
                  <ValueRow label="Göreli pürüzlülük ε/D" unit="[-]" value={results.rel} fmt={(n) => n.toFixed(5)} />
                  <ValueRow label="Boru sürtünmesi f·L/D" unit="[-]" value={results.fL_over_D} fmt={(n) => n.toFixed(3)} />
                  <ValueRow label="Ek parça sürtünmesi f·Leq/D" unit="[-]" value={results.fLeq_over_D} fmt={(n) => n.toFixed(3)} />
                  <ValueRow label="Boru kesit alanı" unit="[mm²]" value={results.alan_mm2} fmt={(n) => n.toFixed(1)} />
                  <ValueRow label="Boru hacmi" unit="[L]" value={results.V_pipe_L} fmt={(n) => n.toFixed(2)} />
                  <ValueRow label="Ortalama bekleme süresi" unit="[s]" value={results.bekleme_s} fmt={(n) => n.toFixed(2)} />
                  <ValueRow label="Tahmini kayma gerilmesi τw" unit="[Pa]" value={results.tau_Pa} fmt={(n) => n.toFixed(1)} />
                </div>
              ) : (
                <div className="text-slate-400">Henüz sonuç yok.</div>
              )}
            </SectionCard>

            <SectionCard title="Basınç düşümleri" grow>
              {results ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
                  <ValueRow label="Boru basınç düşümü" unit="[bar]" value={results.dp_pipe_bar} fmt={(n) => n.toFixed(3)} />
                  <ValueRow label="Ek parçalar basınç düşümü" unit="[bar]" value={results.dp_eq_bar} fmt={(n) => n.toFixed(3)} />
                  <ValueRow label="Kot farkı (statik) düşümü" unit="[bar]" value={results.dp_stat_bar} fmt={(n) => n.toFixed(3)} />
                  <ValueRow label="Toplam basınç düşümü" unit="[bar]" value={results.dp_top_bar} fmt={(n) => n.toFixed(3)} />
                  <ValueRow label="Güç kaybı" unit="[W]" value={results.power_W} fmt={(n) => n.toFixed(1)} />
                </div>
              ) : (
                <div className="text-slate-400">Henüz sonuç yok.</div>
              )}
            </SectionCard>
          </div>
        </div>
      </main>
    </div>
  );
}
