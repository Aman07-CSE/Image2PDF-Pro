import { jsPDF } from 'jspdf';

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Load an image URL into an HTMLImageElement (safe for blob: and data:) */
const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });

/** Draw the image onto a canvas with the given rotation, white bg, return JPEG dataURL */
const toJpegDataUrl = (img, rotationDeg, quality) => {
  const w = img.naturalWidth  || img.width;
  const h = img.naturalHeight || img.height;
  const r = ((rotationDeg % 360) + 360) % 360;

  const canvas = document.createElement('canvas');
  if (r === 90 || r === 270) { canvas.width = h; canvas.height = w; }
  else                        { canvas.width = w; canvas.height = h; }

  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate((r * Math.PI) / 180);
  ctx.drawImage(img, -w / 2, -h / 2);
  return { dataUrl: canvas.toDataURL('image/jpeg', quality), w: canvas.width, h: canvas.height };
};

/** Clean a filename to be OS-safe and end with .pdf */
export const sanitizeFilename = (raw) => {
  if (!raw || typeof raw !== 'string') return 'document.pdf';
  let s = raw.trim().replace(/[/\\?%*:|"<>]/g, '_');
  if (!s.toLowerCase().endsWith('.pdf')) s += '.pdf';
  return s || 'document.pdf';
};

/** Trigger a file download in the browser. Uses Blob directly to avoid double URL problems */
export const triggerDownload = (blob, filename) => {
  const name = sanitizeFilename(filename);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  // Revoke after a short delay to ensure the download starts
  setTimeout(() => URL.revokeObjectURL(url), 5000);
};

// ─── Main export ─────────────────────────────────────────────────────────────

/**
 * Convert an array of { url, rotation } image items into a PDF.
 * Returns { filename, blob, previewUrl } where previewUrl is a long-lived URL for the preview iframe.
 * Caller must call URL.revokeObjectURL(previewUrl) when done.
 */
export const generatePdf = async (images, settings, onProgress) => {
  if (!images || images.length === 0) throw new Error('No images selected.');

  const {
    pageSize   = 'fit',
    orientation = 'auto',
    margin     = 'none',
    quality    = 0.95,
    filename   = 'document.pdf',
  } = settings;

  const MARGIN_MM = { none: 0, small: 5, medium: 10, large: 20 }[margin] ?? 0;
  const STD_SIZES = { a4: [210, 297], letter: [215.9, 279.4], legal: [215.9, 355.6] };

  let pdf = null;

  for (let i = 0; i < images.length; i++) {
    onProgress?.({ current: i + 1, total: images.length, percent: Math.round(((i + 1) / images.length) * 100) });
    await new Promise(r => setTimeout(r, 10)); // let progress re-render

    const { url, rotation = 0 } = images[i];
    const img = await loadImage(url);
    const { dataUrl, w: imgW, h: imgH } = toJpegDataUrl(img, rotation, quality);

    // Page dimensions
    let isLandscape = orientation === 'auto' ? imgW > imgH : orientation === 'landscape';
    let pageW, pageH;

    if (pageSize === 'fit') {
      const px2mm = 25.4 / 96; // 96 dpi → mm
      pageW = imgW * px2mm + MARGIN_MM * 2;
      pageH = imgH * px2mm + MARGIN_MM * 2;
    } else {
      const [shortSide, longSide] = STD_SIZES[pageSize] || STD_SIZES.a4;
      pageW = isLandscape ? longSide : shortSide;
      pageH = isLandscape ? shortSide : longSide;
    }

    // Create or add page
    if (i === 0) {
      pdf = new jsPDF({
        orientation: isLandscape ? 'l' : 'p',
        unit: 'mm',
        format: pageSize === 'fit' ? [pageW, pageH] : pageSize,
        compress: true,
      });
    } else {
      pdf.addPage(pageSize === 'fit' ? [pageW, pageH] : pageSize, isLandscape ? 'l' : 'p');
    }

    // Scale image to fit printable area (with margin) preserving aspect ratio
    const printW = pageW - MARGIN_MM * 2;
    const printH = pageH - MARGIN_MM * 2;
    const aspect = imgW / imgH;
    const printAspect = printW / printH;

    let renderW, renderH;
    if (pageSize === 'fit') {
      renderW = printW;
      renderH = printH;
    } else if (aspect > printAspect) {
      renderW = printW;
      renderH = printW / aspect;
    } else {
      renderH = printH;
      renderW = printH * aspect;
    }

    const x = MARGIN_MM + (printW - renderW) / 2;
    const y = MARGIN_MM + (printH - renderH) / 2;
    pdf.addImage(dataUrl, 'JPEG', x, y, renderW, renderH);
  }

  const cleanName = sanitizeFilename(filename);

  // Get blob
  const blob = pdf.output('blob');

  // Create a URL for the in-app iframe preview (caller owns this, must revoke when done)
  const previewUrl = URL.createObjectURL(blob);

  // NOTE: No auto-download here — user clicks "Download PDF" in the preview modal
  return { filename: cleanName, blob, previewUrl };
};
