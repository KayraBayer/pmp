import React, { useEffect, useRef, useState } from "react";
import type { Results, Inputs } from "../types";
import { usePresets } from "../hooks/usePresets";
import { exportPdfById } from "../utils/pdf";
import { MoreVertical, Save, Download, Upload, FileDown, FilePlus2, FolderOpen, Trash2 } from "lucide-react";

export default function FileBar({ inputs, setInputs, results }: { inputs: Inputs; setInputs: (v: Inputs) => void; results: Results | null; }) {
  const { name, setName, list, yeni, kaydet, farkliKaydet, ac, sil, exportJSON, importJSON } = usePresets(inputs, setInputs);

  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  return (
    <div className="relative flex flex-wrap items-center gap-2 rounded-2xl bg-slate-950/60 p-3 ring-1 ring-slate-800">
      {/* Sol taraf: başlık (minimal) */}
      <div className="hidden sm:block font-semibold text-slate-100">Dosya</div>

      {/* Orta: İsim girişi - mobilde gizli, sm+ görünür */}
      <input
        className="hidden sm:block min-w-[14rem] sm:min-w-[18rem] rounded-lg bg-slate-800 px-3 py-1.5 text-slate-100 outline-none ring-1 ring-slate-700 transition focus:ring-2 focus:ring-indigo-500"
        placeholder="Çalışma adı"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      {/* Birincil eylemler: Kaydet + PDF — her ekranda göster */}
      <div className="ml-auto flex items-center gap-2">
        <button
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-3 py-1.5 text-white shadow-sm transition hover:scale-[1.02] hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          onClick={kaydet}
          title="Kaydet"
        >
          <Save className="h-4 w-4" /> <span className="hidden sm:inline">Kaydet</span>
        </button>
        <button
          className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-3 py-1.5 text-white shadow-sm transition hover:scale-[1.02] hover:bg-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-400"
          onClick={() => exportPdfById("report-root", (name || "hesap") + ".pdf")}
          title="PDF indir"
        >
          <Download className="h-4 w-4" /> <span className="hidden sm:inline">PDF</span>
        </button>

        {/* Sade menü (kebab) */}
        <div className="relative" ref={menuRef}>
          <button
            className={`inline-flex items-center rounded-xl bg-slate-800 p-2 text-slate-100 ring-1 ring-slate-700 transition hover:bg-slate-700 ${open ? "scale-95" : "hover:scale-105"}`}
            onClick={() => setOpen((o) => !o)}
            aria-haspopup="menu"
            aria-expanded={open}
            title="Diğer işlemler"
          >
            <MoreVertical className="h-5 w-5" />
          </button>

          {open && (
            <div
              role="menu"
              className="absolute right-0 top-full z-10 mt-2 w-80 origin-top-right rounded-xl bg-slate-900/95 p-2 text-sm text-slate-100 shadow-xl ring-1 ring-slate-800 backdrop-blur transition"
            >
              {/* Mobilde isim girişi menü içinde */}
              <div className="sm:hidden p-2">
                <label className="mb-1 block text-xs text-slate-400">Çalışma adı</label>
                <input
                  className="w-full rounded-lg bg-slate-800 px-3 py-2 text-slate-100 outline-none ring-1 ring-slate-700 focus:ring-2 focus:ring-indigo-500"
                  placeholder="Çalışma adı"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="grid gap-1 p-1">
                <MenuItem icon={<FilePlus2 className="h-4 w-4" />} onClick={() => { setOpen(false); yeni(); }} label="Yeni" />
                <MenuItem icon={<Save className="h-4 w-4" />} onClick={() => { setOpen(false); kaydet(); }} label="Kaydet" />
                <MenuItem icon={<Save className="h-4 w-4" />} onClick={() => { setOpen(false); farkliKaydet(); }} label="Farklı Kaydet…" />

                <div className="my-1 h-px bg-slate-800" />

                {/* Kayıt Aç alanı */}
                <div className="px-2 py-1">
                  <div className="mb-1 flex items-center gap-2 text-xs text-slate-400">
                    <FolderOpen className="h-3.5 w-3.5" /> Kayıt aç
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      className="w-full rounded-lg bg-slate-800 px-3 py-1.5 text-slate-100 ring-1 ring-slate-700"
                      defaultValue=""
                      onChange={(e) => {
                        if (e.target.value) { ac(e.target.value); setOpen(false); }
                      }}
                    >
                      <option value="" disabled>Seç…</option>
                      {list.map((n) => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                    <button
                      className="rounded-md bg-slate-800 p-2 ring-1 ring-slate-700 transition hover:bg-slate-700"
                      onClick={() => {
                        const n = prompt("Silinecek kayıt adı?", "");
                        if (n) sil(n);
                      }}
                      title="Kayıt sil"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="my-1 h-px bg-slate-800" />

                <MenuItem icon={<Upload className="h-4 w-4" />} onClick={() => { setOpen(false); importJSON(); }} label="İçe Aktar (JSON)" />
                <MenuItem icon={<FileDown className="h-4 w-4" />} onClick={() => { setOpen(false); exportJSON(results); }} label="Dışa Aktar (JSON)" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MenuItem({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick?: () => void; }) {
  return (
    <button
      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-600"
      onClick={onClick}
      role="menuitem"
    >
      <span className="grid h-6 w-6 place-items-center rounded-md bg-slate-800/80 ring-1 ring-slate-700">{icon}</span>
      <span>{label}</span>
    </button>
  );
}