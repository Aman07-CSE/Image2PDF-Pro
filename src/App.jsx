import React, { useState, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Header } from './components/Header';
import { UploadZone } from './components/UploadZone';
import { ImageGrid } from './components/ImageGrid';
import { PDFSettings } from './components/PDFSettings';
import { ImageModal } from './components/ImageModal';
import { ProgressBarModal } from './components/ProgressBarModal';
import { PDFPreviewModal } from './components/PDFPreviewModal';
import { generatePdf, triggerDownload } from './utils/pdfGenerator';
import { Settings } from 'lucide-react';

let nextId = 1;

export default function App() {
  const [images, setImages] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(null);
  const [pdfResult, setPdfResult] = useState(null);
  const [showMobileSettings, setShowMobileSettings] = useState(false);
  const previewUrlRef = useRef(null);

  const [settings, setSettings] = useState({
    pageSize: 'fit',
    orientation: 'auto',
    margin: 'none',
    quality: 0.95,
    filename: 'Converted_Document',
  });

  // ── Image management ──────────────────────────────────────────────────────

  const addImages = useCallback((files) => {
    const items = files.map(f => ({
      id: `img-${nextId++}`,
      name: f.name,
      size: f.size,
      url: URL.createObjectURL(f),
      rotation: 0,
    }));
    setImages(prev => [...prev, ...items]);
    // Auto-hide mobile settings sheet when new images are added
    setShowMobileSettings(false);
  }, []);

  const removeImage = useCallback((id) => {
    setImages(prev => {
      const img = prev.find(i => i.id === id);
      if (img) URL.revokeObjectURL(img.url);
      return prev.filter(i => i.id !== id);
    });
    setPreviewImage(prev => (prev?.id === id ? null : prev));
  }, []);

  const rotateImage = useCallback((id, deg) => {
    setImages(prev => prev.map(img =>
      img.id === id
        ? { ...img, rotation: ((img.rotation + deg) % 360 + 360) % 360 }
        : img
    ));
    setPreviewImage(prev =>
      prev?.id === id
        ? { ...prev, rotation: ((prev.rotation + deg) % 360 + 360) % 360 }
        : prev
    );
  }, []);

  const reorderImages = useCallback((newList) => setImages(newList), []);

  const clearAll = useCallback(() => {
    setImages(prev => { prev.forEach(i => URL.revokeObjectURL(i.url)); return []; });
    setPreviewImage(null);
    closePdfResult();
  }, []);

  const reverseOrder = useCallback(() => setImages(prev => [...prev].reverse()), []);

  const sortByName = useCallback(() =>
    setImages(prev => [...prev].sort((a, b) =>
      a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' })
    )), []);

  // ── PDF result ────────────────────────────────────────────────────────────

  const closePdfResult = () => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
    setPdfResult(null);
  };

  // ── PDF generation ────────────────────────────────────────────────────────

  const handleConvert = async () => {
    if (images.length === 0 || isGenerating) return;
    setShowMobileSettings(false);

    const finalSettings = {
      ...settings,
      filename: settings.filename.trim() || 'Converted_Document',
    };

    try {
      setIsGenerating(true);
      closePdfResult();
      setProgress({ current: 0, total: images.length, percent: 0 });

      const result = await generatePdf(images, finalSettings, setProgress);

      previewUrlRef.current = result.previewUrl;
      setPdfResult(result);
      setProgress(null);
      setIsGenerating(false);

      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    } catch (err) {
      console.error('PDF Error:', err);
      alert(`Failed to generate PDF: ${err.message}`);
      setProgress(null);
      setIsGenerating(false);
    }
  };

  const handleReDownload = () => {
    if (pdfResult?.blob) triggerDownload(pdfResult.blob, pdfResult.filename);
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="app-layout">
      <Header />

      <main className="main-container">
        {images.length === 0 ? (
          <div className="empty-state-wrapper">
            <UploadZone onImagesSelected={addImages} />
          </div>
        ) : (
          <div className="workspace-grid">
            {/* Image grid */}
            <div className="workspace-main">
              <ImageGrid
                images={images}
                onReorder={reorderImages}
                onRotate={rotateImage}
                onRemove={removeImage}
                onClearAll={clearAll}
                onReverseOrder={reverseOrder}
                onSortByName={sortByName}
                onPreviewImage={setPreviewImage}
                onAddMoreImages={addImages}
              />
            </div>

            {/* Settings sidebar — hidden on mobile, shown via floating button */}
            <div className={`workspace-sidebar ${showMobileSettings ? 'mobile-visible' : ''}`}>
              {/* Mobile sheet handle */}
              <div
                className="mobile-sheet-handle"
                onClick={() => setShowMobileSettings(false)}
              />
              <PDFSettings
                settings={settings}
                onSettingsChange={setSettings}
                onGeneratePDF={handleConvert}
                isGenerating={isGenerating}
                imageCount={images.length}
                hasPdf={!!pdfResult}
                onViewPdf={() => setPdfResult(r => r ? { ...r } : r)}
              />
            </div>

            {/* Mobile backdrop */}
            {showMobileSettings && (
              <div
                className="mobile-settings-backdrop"
                onClick={() => setShowMobileSettings(false)}
              />
            )}
          </div>
        )}
      </main>

      {/* Mobile floating action button */}
      {images.length > 0 && (
        <button
          type="button"
          className={`mobile-fab ${isGenerating ? 'fab-generating' : ''}`}
          onClick={() => isGenerating ? null : setShowMobileSettings(prev => !prev)}
          title="PDF Settings & Convert"
        >
          {isGenerating ? (
            <div className="fab-spinner" />
          ) : (
            <Settings size={22} />
          )}
          <span className="fab-label">{isGenerating ? 'Converting…' : 'Convert to PDF'}</span>
        </button>
      )}

      {/* Image lightbox */}
      <ImageModal
        image={previewImage}
        onClose={() => setPreviewImage(null)}
        onRotate={rotateImage}
      />

      {/* Progress overlay */}
      <ProgressBarModal progress={progress} />

      {/* PDF preview + download */}
      <PDFPreviewModal
        pdfResult={pdfResult}
        onClose={closePdfResult}
        onDownload={handleReDownload}
      />
    </div>
  );
}
