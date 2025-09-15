import type { Inputs, Results } from "../types";

const clamp = (x: number, eps = 1e-12) => (Math.abs(x) < eps ? (x < 0 ? -eps : eps) : x);
const toNum = (s: string | undefined, fallback: number) => {
  if (s == null || s === "") return fallback;
  const n = Number(String(s).replace(",", "."));
  return Number.isFinite(n) ? n : fallback;
};

export function compute(inputs: Inputs): Results {
  const Q_lph = toNum(inputs.debi_lph, 17000);
  const rho = toNum(inputs.yog, 1000); // kg/m3
  const mu_cP = toNum(inputs.viz_cp, 1); // cP
  const D_mm = toNum(inputs.cap_mm, 48.5);
  const eps_mm = toNum(inputs.pur_mm, 0.01);
  const L = toNum(inputs.uzun_m, 200);
  const dh = toNum(inputs.kot_m, 6);
  const extra_bar = toNum(inputs.harici_bar, 0);
  const elbows_ld = toNum(inputs.dirsek_ld, 240);
  const valves_ld = toNum(inputs.vana_ld, 0);
  const fittings_m = toNum(inputs.parca_m, 11.664);

  const Q = Q_lph / 3600 / 1000; // m^3/s
  const D = D_mm / 1000; // m
  const A = Math.PI * (D ** 2) / 4; // m^2
  const v = A > 0 ? Q / A : 0; // m/s
  const mu = mu_cP / 1000; // Pa·s
  const eps = eps_mm / 1000; // m

  const Re = (rho * v * D) / clamp(mu);

  let f: number;
  let rejim: Results["rejim"];
  if (Re < 2300) {
    f = 64 / clamp(Re);
    rejim = "Laminer";
  } else if (Re < 4000) {
    f = 0.25 / Math.pow(Math.log10((eps / (3.7 * clamp(D))) + (5.74 / Math.pow(clamp(Re), 0.9))), 2);
    rejim = "Geçiş";
  } else {
    f = 0.25 / Math.pow(Math.log10((eps / (3.7 * clamp(D))) + (5.74 / Math.pow(clamp(Re), 0.9))), 2);
    rejim = "Türbülanslı";
  }

  const Leq = (elbows_ld + valves_ld) * D + fittings_m; // m
  const fL_over_D = D > 0 ? f * (L / D) : 0;
  const fLeq_over_D = D > 0 ? f * (Leq / D) : 0;

  const dyn = 0.5 * rho * v * v; // Pa
  const dp_pipe_pa = fL_over_D * dyn;
  const dp_eq_pa = fLeq_over_D * dyn;
  const dp_stat_pa = rho * 9.80665 * dh;
  const dp_extra_pa = extra_bar * 1e5;
  const dp_tot_pa = dp_pipe_pa + dp_eq_pa + dp_stat_pa + dp_extra_pa;

  const alan_mm2 = A * 1e6;
  const V_pipe_L = A * L * 1000;
  const bekleme_s = Q > 0 ? (A * L) / Q : 0;
  const rel = D > 0 ? eps / D : 0;
  const tau_Pa = (f / 8) * rho * v * v;
  const power_W = dp_tot_pa * Q; // W

  return {
    Re,
    v_ms: v,
    f,
    rel,
    fL_over_D,
    fLeq_over_D,
    alan_mm2,
    V_pipe_L,
    bekleme_s,
    tau_Pa,
    dp_pipe_bar: dp_pipe_pa / 1e5,
    dp_eq_bar: dp_eq_pa / 1e5,
    dp_stat_bar: dp_stat_pa / 1e5,
    dp_top_bar: dp_tot_pa / 1e5,
    power_W,
    rejim,
  };
}