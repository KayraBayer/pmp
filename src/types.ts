export type Inputs = {
  debi_lph: string; // L/saat
  yog: string; // kg/m3
  viz_cp: string; // cP
  cap_mm: string; // mm
  pur_mm: string; // mm (epsilon)
  uzun_m: string; // m (L)
  kot_m: string; // m (dh)
  harici_bar: string; // bar
  dirsek_ld: string; // l/d
  vana_ld: string; // l/d
  parca_m: string; // m
};

export type Results = {
  Re: number;
  v_ms: number;
  f: number;
  rel: number;
  fL_over_D: number;
  fLeq_over_D: number;
  alan_mm2: number;
  V_pipe_L: number;
  bekleme_s: number;
  tau_Pa: number;
  dp_pipe_bar: number;
  dp_eq_bar: number;
  dp_stat_bar: number;
  dp_top_bar: number;
  power_W: number;
  rejim: "Laminer" | "Geçiş" | "Türbülanslı";
};

export type FieldDef = {
  key: keyof Inputs;
  label: string;
  unit?: string;
  placeholder?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
};

export type FieldGroup = {
  title: string;
  fields: FieldDef[];
};