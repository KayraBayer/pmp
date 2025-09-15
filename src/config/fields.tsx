import type { FieldGroup, Inputs } from "../types";

export const DEFAULTS: Inputs = {
  debi_lph: "17000",
  yog: "1000",
  viz_cp: "1",
  cap_mm: "48.5",
  pur_mm: "0.01",
  uzun_m: "200",
  kot_m: "6",
  harici_bar: "0",
  dirsek_ld: "240",
  vana_ld: "0",
  parca_m: "11.664",
};

export const GROUPS: FieldGroup[] = [
  {
    title: "Akışkan verileri",
    fields: [
      { key: "debi_lph", label: "Hacimsel debi", unit: "[L/saat]", placeholder: DEFAULTS.debi_lph, inputMode: "decimal" },
      { key: "yog", label: "Yoğunluk", unit: "[kg/m³]", placeholder: DEFAULTS.yog, inputMode: "decimal" },
      { key: "viz_cp", label: "Dinamik viskozite", unit: "[cP]", placeholder: DEFAULTS.viz_cp, inputMode: "decimal" },
    ],
  },
  {
    title: "Boru verileri",
    fields: [
      { key: "cap_mm", label: "İç çap", unit: "[mm]", placeholder: DEFAULTS.cap_mm, inputMode: "decimal" },
      { key: "pur_mm", label: "Yüzey pürüzlülüğü ε", unit: "[mm]", placeholder: DEFAULTS.pur_mm, inputMode: "decimal" },
      { key: "uzun_m", label: "Toplam boru uzunluğu L", unit: "[m]", placeholder: DEFAULTS.uzun_m, inputMode: "decimal" },
      { key: "kot_m", label: "Kot farkı (yükselme +)", unit: "[m]", placeholder: DEFAULTS.kot_m, inputMode: "decimal" },
      { key: "harici_bar", label: "Harici ekipman kaybı", unit: "[bar]", placeholder: DEFAULTS.harici_bar, inputMode: "decimal" },
    ],
  },
  {
    title: "Eşdeğer uzunluk (ek parçalar)",
    fields: [
      { key: "dirsek_ld", label: "Dirsek & dönüşler", unit: "[l/d]", placeholder: DEFAULTS.dirsek_ld, inputMode: "decimal" },
      { key: "vana_ld", label: "Vanalar", unit: "[l/d]", placeholder: DEFAULTS.vana_ld, inputMode: "decimal" },
      { key: "parca_m", label: "Bağlantı/parça metre karşılığı", unit: "[m]", placeholder: DEFAULTS.parca_m, inputMode: "decimal" },
    ],
  },
];