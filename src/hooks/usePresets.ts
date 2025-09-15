import { useMemo, useState } from "react";
import type { Inputs, Results } from "../types";

const LS_LAST = "pipecalc:last";
const LS_PRESETS = "pipecalc:presets"; // { [name: string]: Inputs }

function readPresets(): Record<string, Inputs> {
  try {
    const s = localStorage.getItem(LS_PRESETS);
    return s ? (JSON.parse(s) as Record<string, Inputs>) : {};
  } catch {
    return {};
  }
}
function writePresets(obj: Record<string, Inputs>) {
  localStorage.setItem(LS_PRESETS, JSON.stringify(obj));
}
export function saveLast(v: Inputs) {
  localStorage.setItem(LS_LAST, JSON.stringify(v));
}
export function loadLast(): Inputs | null {
  try {
    const s = localStorage.getItem(LS_LAST);
    return s ? (JSON.parse(s) as Inputs) : null;
  } catch {
    return null;
  }
}

export function usePresets(inputs: Inputs, setInputs: (v: Inputs) => void) {
  const [name, setName] = useState("");
  const list = useMemo(() => Object.keys(readPresets()).sort((a,b)=>a.localeCompare(b,"tr")), [name, inputs]);

  function yeni() { if (confirm("Form sıfırlansın mı?")) setInputs({
    debi_lph: "", yog: "", viz_cp: "", cap_mm: "", pur_mm: "", uzun_m: "", kot_m: "", harici_bar: "", dirsek_ld: "", vana_ld: "", parca_m: "",
  }); }

  function kaydet() {
    if (!name.trim()) return alert("Lütfen bir isim girin (Farklı Kaydet kullanabilirsiniz).");
    const obj = readPresets();
    obj[name] = inputs; writePresets(obj); alert(`'${name}' kaydedildi.`);
  }
  function farkliKaydet() {
    const n = prompt("Bu ayarları hangi isimle kaydetmek istersiniz?", name || "Yeni Hesap");
    if (!n) return; setName(n); const obj = readPresets(); obj[n] = inputs; writePresets(obj);
  }
  function ac(n: string) { const obj = readPresets(); if (obj[n]) { setInputs({ ...obj[n] }); setName(n); } }
  function sil(n: string) { if (!confirm(`'${n}' silinsin mi?`)) return; const obj = readPresets(); delete obj[n]; writePresets(obj); if (n===name) setName(""); }

  function exportJSON(results: Results | null) {
    const payload = { name, inputs, results, savedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = `${name || "hesap"}.json`; a.click(); URL.revokeObjectURL(url);
  }

  function importJSON(onLoaded?: (name?: string)=>void) {
    const input = document.createElement("input"); input.type = "file"; input.accept = "application/json";
    input.onchange = () => {
      const file = input.files?.[0]; if (!file) return; const fr = new FileReader();
      fr.onload = () => { try { const obj = JSON.parse(String(fr.result)); if (obj?.inputs) setInputs({ ...(obj.inputs as Inputs) }); if (obj?.name) { setName(String(obj.name)); onLoaded?.(String(obj.name)); } } catch { alert("Dosya okunamadı. Geçerli bir JSON seçin."); } };
      fr.readAsText(file);
    };
    input.click();
  }

  return { name, setName, list, yeni, kaydet, farkliKaydet, ac, sil, exportJSON, importJSON };
}