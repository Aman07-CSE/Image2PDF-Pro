import React, { useState } from 'react';
import { Download, X, FileText, CheckCircle2, ExternalLink } from 'lucide-react';

const fmtSize = (blob) => {
  if (!blob?.size) return '';
  const b = blob.size;
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / (1024 * 1024)).toFixed(2)} MB`;
};

export const PDFPreviewModal = ({ pdfResult, onClose, onDownload }) => {
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [showFallback, setShowFallback] = useState(false);

  if (!pdfResult) return null;

  const { previewUrl, filename, blob } = pdfResult;

  // Try to detect if this is iOS Safari (no PDF embed support)
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  const forceFallback = isIOS || showFallback;

  // Open PDF in a new tab — works universally (including mobile browsers)
  const openInNewTab = () => {
    if (previewUrl) window.open(previewUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="modal-backdrop preview-modal-backdrop" onClick={onClose}>
      <div className="pdf-preview-container" onClick={(e) => e.stopPropagation()}>

        {/* ── Header ─────────────────────────────────────── */}
        <div className="pdf-preview-header">
          <div className="preview-header-info">
            <div className="pdf-icon-badge">
              <FileText size={22} />
            </div>
            <div>
              <div className="preview-filename-title">
                <span className="preview-fname">{filename}</span>
                <span className="success-tag">
                  <CheckCircle2 size={11} /> Ready
                </span>
              </div>
              <p className="preview-subtext">{fmtSize(blob)} · High Quality PDF</p>
            </div>
          </div>

          <div className="preview-header-actions">
            {/* Open in new tab — works on all browsers/mobile */}
            <button
              type="button"
              className="btn-open-tab"
              onClick={openInNewTab}
              title="Open PDF in new tab"
            >
              <ExternalLink size={15} />
              <span className="btn-label-hide-xs">Open</span>
            </button>

            {/* Download button */}
            <button
              type="button"
              className="btn-download-glow"
              onClick={onDownload}
              title="Download PDF file"
            >
              <Download size={17} />
              <span>Download PDF</span>
            </button>

            <button
              type="button"
              className="modal-icon-btn close-btn"
              onClick={onClose}
              title="Close"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* ── Body: PDF Viewer ────────────────────────────── */}
        <div className="pdf-preview-body">
          {forceFallback ? (
            /* Fallback for iOS / browsers that block PDF embed */
            <div className="preview-fallback-card">
              <FileText size={52} className="fallback-icon" />
              <h3>PDF Ready to Download!</h3>
              <p>Your device doesn't support in-browser PDF preview.<br />Use the buttons below to view or save it.</p>
              <div className="fallback-btn-group">
                <button type="button" className="btn-download-glow large-btn" onClick={onDownload}>
                  <Download size={20} />
                  Download PDF
                </button>
                <button type="button" className="btn-open-tab large-btn" onClick={openInNewTab}>
                  <ExternalLink size={18} />
                  Open in Browser
                </button>
              </div>
            </div>
          ) : (
            /* iframe-based preview for Chrome, Edge, Firefox desktop */
            <>
              {!iframeLoaded && (
                <div className="iframe-loading">
                  <div className="iframe-spinner" />
                  <span>Loading preview…</span>
                </div>
              )}
              <iframe
                key={previewUrl}
                src={previewUrl}
                title="PDF Preview"
                className="pdf-iframe-viewer"
                style={{ display: iframeLoaded ? 'block' : 'none' }}
                onLoad={() => setIframeLoaded(true)}
                onError={() => { setIframeLoaded(true); setShowFallback(true); }}
              />
              {/* Fallback trigger if iframe loads but PDF not rendered (some mobile) */}
              {iframeLoaded && !forceFallback && (
                <button
                  type="button"
                  className="fallback-trigger-btn"
                  onClick={() => setShowFallback(true)}
                  title="Can't see the PDF? Switch to download view"
                >
                  Can't see the PDF?
                </button>
              )}
            </>
          )}
        </div>

        {/* ── Footer ─────────────────────────────────────── */}
        <div className="pdf-preview-footer">
          <span className="footer-hint">
            ✅ Click <strong>Download PDF</strong> to save to your device.
          </span>
          <button type="button" className="btn-footer-close" onClick={onClose}>
            Back to Editor
          </button>
        </div>
      </div>
    </div>
  );
};
