import React, { useRef, useState } from 'react';
import { UploadCloud, Image as ImageIcon, PlusCircle } from 'lucide-react';

export const UploadZone = ({ onImagesSelected, compact = false }) => {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const processFiles = (fileList) => {
    const rawFiles = Array.from(fileList);
    const validImages = rawFiles.filter(file => file.type.startsWith('image/') || /\.(png|jpe?g|webp|bmp|gif|heic|tiff?|svg)$/i.test(file.name));
    
    if (validImages.length < rawFiles.length) {
      const skippedCount = rawFiles.length - validImages.length;
      alert(`Skipped ${skippedCount} non-image file(s). Please upload image files.`);
    }

    if (validImages.length > 0) {
      onImagesSelected(validImages);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
      e.target.value = '';
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const triggerSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  if (compact) {
    return (
      <div 
        className={`upload-zone-compact ${isDragging ? 'dragging' : ''}`}
        onClick={triggerSelect}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        <PlusCircle size={20} className="pulse-icon" />
        <span>Add More Images</span>
      </div>
    );
  }

  return (
    <div
      className={`upload-zone-main ${isDragging ? 'dragging' : ''}`}
      onClick={triggerSelect}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      
      <div className="upload-icon-circle">
        <UploadCloud size={48} className="upload-icon" />
      </div>

      <div className="upload-text">
        <h3>Choose or Drag & Drop Images</h3>
        <p className="subtext">
          Select multiple images from your gallery or computer in any order
        </p>
      </div>

      <button type="button" className="btn-upload-trigger">
        <ImageIcon size={18} />
        Browse Files
      </button>

      <div className="supported-formats">
        <span className="format-badge">PNG</span>
        <span className="format-badge">JPG / JPEG</span>
        <span className="format-badge">WEBP</span>
        <span className="format-badge">SVG</span>
        <span className="format-badge">BMP</span>
        <span className="format-badge">GIF</span>
      </div>
    </div>
  );
};
