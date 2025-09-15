// src/utils/pdf.ts
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { toPng } from "html-to-image";

function ensurePdfSafeStyles() {
  const id = "__pdf_safe_styles__";
  if (document.getElementById(id)) return;

  const style = document.createElement("style");
  style.id = id;
  style.textContent = `
.pdf-safe, .pdf-safe * {
  background-image: none !important;
  background: none !important;
  box-shadow: none !important;
  text-shadow: none !important;
  filter: none !important;
  backdrop-filter: none !important;
}
.pdf-safe {
  background-color: #0b1220 !important;
  color: #e5e7eb !important;
}
.pdf-safe * {
  border-color: rgba(255,255,255,0.12) !important;
  outline-color: transparent !important;
  caret-color: auto !important;
  text-decoration-color: currentColor !important;
  -webkit-text-fill-color: inherit !important;
  -webkit-text-stroke-color: inherit !important;
  --tw-ring-color: rgba(255,255,255,0.12) !important;
  --tw-ring-offset-shadow: 0 0 #0000 !important;
  --tw-ring-shadow: 0 0 #0000 !important;
}
.pdf-safe svg * {
  fill: currentColor !important;
  stroke: currentColor !important;
}
  `.trim();
  document.head.appendChild(style);
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((res, rej) => {
    const img = new Image();
    img.onload = () => res(img);
    img.onerror = rej;
    img.src = url;
  });
}

async function rasterize(el: HTMLElement, elementId: string): Promise<{ dataUrl: string; width: number; height: number; }> {
  // 1) Önce html2canvas dene (daha keskin, hızlı)
  try {
    const canvas = await html2canvas(el, {
      scale: 2,
      backgroundColor: "#0b1220",
      useCORS: true,
      allowTaint: true,
      logging: false,
      onclone: (doc) => {
        const target = doc.getElementById(elementId);
        if (target) target.classList.add("pdf-safe");
      },
    });
    return {
      dataUrl: canvas.toDataURL("image/png"),
      width: canvas.width,
      height: canvas.height,
    };
  } catch (e: any) {
    const msg = String(e?.message || e);
    // 2) html2canvas oklch'te düşerse html-to-image fallback
    if (msg.includes("unsupported color function") || msg.includes("oklch")) {
      const dataUrl = await toPng(el, {
        pixelRatio: 2,
        backgroundColor: "#0b1220",
        // Güvenli modun etkisini artırmak için yine klonlamadaki sınıfa güveniyoruz.
        // html-to-image computed stil aldığı için genelde sorun çıkmaz.
        cacheBust: true,
        // İstersen bazı node’ları dışla:
        filter: (node) => !(node instanceof Element && node.tagName === "SCRIPT"),
      });
      const img = await loadImage(dataUrl);
      return { dataUrl, width: img.naturalWidth || img.width, height: img.naturalHeight || img.height };
    }
    throw e;
  }
}

export async function exportPdfById(elementId: string, filename = "rapor.pdf") {
  const el = document.getElementById(elementId);
  if (!el) {
    alert("Rapor alanı bulunamadı.");
    return;
  }

  ensurePdfSafeStyles();
  el.classList.add("pdf-safe");

  try {
    const { dataUrl, width, height } = await rasterize(el, elementId);

    const pdf = new jsPDF({ unit: "pt", format: "a4", orientation: "portrait" });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Görseli sayfaya oranla yerleştir
    const imgWidth = pageWidth;
    const imgHeight = (height * imgWidth) / width;

    let yLeft = imgHeight;
    let yPos = 0;

    pdf.addImage(dataUrl, "PNG", 0, yPos, imgWidth, imgHeight);
    yLeft -= pageHeight;

    while (yLeft > 0) {
      pdf.addPage();
      yPos = yLeft * -1;
      pdf.addImage(dataUrl, "PNG", 0, yPos, imgWidth, imgHeight);
      yLeft -= pageHeight;
    }

    pdf.save(filename);
  } catch (err) {
    console.error(err);
    alert("PDF oluşturulurken bir hata oluştu (detaylar konsolda).");
  } finally {
    el.classList.remove("pdf-safe");
  }
}
