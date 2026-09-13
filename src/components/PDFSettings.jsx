import React from 'react';
import { 
  Settings, 
  FileText, 
  Compass, 
  Maximize, 
  Sliders, 
  Download, 
  Sparkles, 
  Layers,
  Eye
} from 'lucide-react';

export const PDFSettings = ({ 
  settings, 
  onSettingsChange, 
  onGeneratePDF, 
  isGenerating, 
  imageCount,
  hasPdf,
  onViewPdf
}) => {
  const handleChange = (field, value) => {
    onSettingsChange({
      ...settings,
      [field]: value
    });
  };

  const handleFilenameChange = (val) => {
    // Strip illegal chars but don't append .pdf here (pdfGenerator handles that)
    const clean = val.replace(/[/\\?%*:|"<>]/g, '');
    handleChange('filename', clean);
  };

  return (
    <aside className="pdf-settings-panel">
      <div className="panel-header">
        <Settings size={20} className="panel-icon" />
        <h3>PDF Export Settings</h3>
      </div>

      <div className="settings-form">
        {/* Output Filename */}
        <div className="form-group">
          <label className="form-label">
            <FileText size={14} />
            Output Filename
          </label>
          <div className="input-with-extension">
            <input
              type="text"
              className="form-input"
              value={settings.filename}
              onChange={(e) => handleFilenameChange(e.target.value)}
              placeholder="Converted_Document"
            />
            <span className="extension-badge">.pdf</span>
          </div>
        </div>

        {/* Page Size */}
        <div className="form-group">
          <label className="form-label">
            <Maximize size={14} />
            Paper Size
          </label>
          <div className="segmented-control">
            <button
              type="button"
              className={`segmented-btn ${settings.pageSize === 'fit' ? 'active' : ''}`}
              onClick={() => handleChange('pageSize', 'fit')}
            >
              Auto Fit
            </button>
            <button
              type="button"
              className={`segmented-btn ${settings.pageSize === 'a4' ? 'active' : ''}`}
              onClick={() => handleChange('pageSize', 'a4')}
            >
              A4
            </button>
            <button
              type="button"
              className={`segmented-btn ${settings.pageSize === 'letter' ? 'active' : ''}`}
              onClick={() => handleChange('pageSize', 'letter')}
            >
              Letter
            </button>
            <button
              type="button"
              className={`segmented-btn ${settings.pageSize === 'legal' ? 'active' : ''}`}
              onClick={() => handleChange('pageSize', 'legal')}
            >
              Legal
            </button>
          </div>
        </div>

        {/* Orientation */}
        <div className="form-group">
          <label className="form-label">
            <Compass size={14} />
            Orientation
          </label>
          <div className="segmented-control">
            <button
              type="button"
              className={`segmented-btn ${settings.orientation === 'auto' ? 'active' : ''}`}
              onClick={() => handleChange('orientation', 'auto')}
            >
              Auto Detect
            </button>
            <button
              type="button"
              className={`segmented-btn ${settings.orientation === 'portrait' ? 'active' : ''}`}
              onClick={() => handleChange('orientation', 'portrait')}
            >
              Portrait
            </button>
            <button
              type="button"
              className={`segmented-btn ${settings.orientation === 'landscape' ? 'active' : ''}`}
              onClick={() => handleChange('orientation', 'landscape')}
            >
              Landscape
            </button>
          </div>
        </div>

        {/* Page Margins */}
        <div className="form-group">
          <label className="form-label">
            <Layers size={14} />
            Page Margins
          </label>
          <div className="segmented-control">
            <button
              type="button"
              className={`segmented-btn ${settings.margin === 'none' ? 'active' : ''}`}
              onClick={() => handleChange('margin', 'none')}
            >
              None (0mm)
            </button>
            <button
              type="button"
              className={`segmented-btn ${settings.margin === 'small' ? 'active' : ''}`}
              onClick={() => handleChange('margin', 'small')}
            >
              Small (5mm)
            </button>
            <button
              type="button"
              className={`segmented-btn ${settings.margin === 'medium' ? 'active' : ''}`}
              onClick={() => handleChange('margin', 'medium')}
            >
              Medium (10mm)
            </button>
            <button
              type="button"
              className={`segmented-btn ${settings.margin === 'large' ? 'active' : ''}`}
              onClick={() => handleChange('margin', 'large')}
            >
              Large (20mm)
            </button>
          </div>
        </div>

        {/* Quality / Resolution Slider */}
        <div className="form-group">
          <div className="label-with-value">
            <label className="form-label">
              <Sliders size={14} />
              Image Quality / Resolution
            </label>
            <span className="slider-value-badge">
              {Math.round(settings.quality * 100)}% {settings.quality >= 0.9 ? '(Lossless)' : '(Compressed)'}
            </span>
          </div>
          <input
            type="range"
            min="0.3"
            max="1.0"
            step="0.05"
            className="quality-slider"
            value={settings.quality}
            onChange={(e) => handleChange('quality', parseFloat(e.target.value))}
          />
          <div className="slider-range-labels">
            <span>Smaller Size</span>
            <span>Original Lossless</span>
          </div>
        </div>
      </div>

      {/* Summary Box */}
      <div className="settings-summary">
        <div className="summary-row">
          <span>Target Pages:</span>
          <strong>{imageCount} {imageCount === 1 ? 'Page' : 'Pages'}</strong>
        </div>
        <div className="summary-row">
          <span>Paper Format:</span>
          <strong>{settings.pageSize.toUpperCase()} ({settings.orientation})</strong>
        </div>
        <div className="summary-row">
          <span>Output Quality:</span>
          <strong>{Math.round(settings.quality * 100)}% Original DPI</strong>
        </div>
      </div>

      {/* Primary Conversion Button */}
      <button
        type="button"
        className="btn-convert-primary"
        onClick={onGeneratePDF}
        disabled={isGenerating || imageCount === 0}
      >
        {isGenerating ? (
          <>
            <div className="btn-spinner"></div>
            <span>Generating PDF...</span>
          </>
        ) : (
          <>
            <Download size={20} />
            <span>Convert & Download PDF</span>
            <Sparkles size={16} className="btn-sparkle" />
          </>
        )}
      </button>

      {/* Quick View PDF button if already generated */}
      {hasPdf && !isGenerating && (
        <button
          type="button"
          className="btn-modal-view"
          onClick={onViewPdf}
          style={{ width: '100%', marginTop: '0.6rem' }}
        >
          <Eye size={16} />
          <span>View Generated PDF</span>
        </button>
      )}
    </aside>
  );
};
