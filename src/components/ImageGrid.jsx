import React, { useState } from 'react';
import { 
  RotateCw, 
  RotateCcw, 
  Trash2, 
  ArrowLeft, 
  ArrowRight, 
  Maximize2, 
  GripVertical, 
  RotateCcw as ResetIcon, 
  ArrowUpDown, 
  FileCheck
} from 'lucide-react';
import { UploadZone } from './UploadZone';

export const ImageGrid = ({ 
  images, 
  onReorder, 
  onRotate, 
  onRemove, 
  onClearAll, 
  onReverseOrder, 
  onSortByName, 
  onPreviewImage,
  onAddMoreImages
}) => {
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    try {
      const ghost = new Image();
      ghost.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
      e.dataTransfer.setDragImage(ghost, 0, 0);
    } catch {
      // Fallback for older browsers
    }
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    setDragOverIndex(index);
  };

  const handleDrop = (e, index) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== index) {
      const newImages = [...images];
      const [movedItem] = newImages.splice(draggedIndex, 1);
      newImages.splice(index, 0, movedItem);
      onReorder(newImages);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const moveItem = (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= images.length) return;
    const newImages = [...images];
    const [movedItem] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, movedItem);
    onReorder(newImages);
  };

  const handleClearClick = () => {
    if (images.length === 0) return;
    if (window.confirm('Are you sure you want to remove all selected images?')) {
      onClearAll();
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="image-grid-section">
      {/* Grid Control Toolbar */}
      <div className="grid-toolbar">
        <div className="toolbar-left">
          <div className="counter-pill">
            <FileCheck size={16} />
            <span>{images.length} {images.length === 1 ? 'Image' : 'Images'} Selected</span>
          </div>
          <span className="order-hint">Drag cards or use arrows to rearrange sequence</span>
        </div>

        <div className="toolbar-right">
          <button 
            type="button" 
            className="toolbar-btn text-btn"
            onClick={onSortByName}
            title="Sort alphabetically by filename"
          >
            <ArrowUpDown size={14} />
            Sort Name
          </button>

          <button 
            type="button" 
            className="toolbar-btn text-btn"
            onClick={onReverseOrder}
            title="Reverse image order"
          >
            <ResetIcon size={14} />
            Reverse
          </button>

          <button 
            type="button" 
            className="toolbar-btn danger-btn"
            onClick={handleClearClick}
            title="Clear all images"
          >
            <Trash2 size={14} />
            Clear All
          </button>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="cards-grid">
        {images.map((img, index) => {
          const isDraggingThis = draggedIndex === index;
          const isDragTarget = dragOverIndex === index;

          return (
            <div
              key={img.id}
              className={`image-card ${isDraggingThis ? 'is-dragging' : ''} ${isDragTarget ? 'is-drag-target' : ''}`}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
            >
              {/* Page Number Badge */}
              <div className="card-page-badge">
                Page {index + 1}
              </div>

              {/* Drag Handle */}
              <div className="drag-handle" title="Drag to reorder">
                <GripVertical size={16} />
              </div>

              {/* Thumbnail Container */}
              <div className="thumbnail-wrapper" onClick={() => onPreviewImage(img)}>
                <img
                  src={img.url}
                  alt={img.name}
                  className="thumbnail-img"
                  style={{
                    transform: `rotate(${img.rotation || 0}deg)`
                  }}
                />
                <div className="preview-overlay">
                  <Maximize2 size={24} className="zoom-icon" />
                </div>
              </div>

              {/* Info Bar */}
              <div className="card-info">
                <span className="card-filename" title={img.name}>{img.name}</span>
                <span className="card-filesize">{formatFileSize(img.size)}</span>
              </div>

              {/* Action Toolbar */}
              <div className="card-actions">
                <button
                  type="button"
                  className="action-btn"
                  onClick={() => moveItem(index, index - 1)}
                  disabled={index === 0}
                  title="Move Left/Up"
                >
                  <ArrowLeft size={14} />
                </button>

                <button
                  type="button"
                  className="action-btn"
                  onClick={() => moveItem(index, index + 1)}
                  disabled={index === images.length - 1}
                  title="Move Right/Down"
                >
                  <ArrowRight size={14} />
                </button>

                <button
                  type="button"
                  className="action-btn"
                  onClick={() => onRotate(img.id, -90)}
                  title="Rotate Counter-Clockwise"
                >
                  <RotateCcw size={14} />
                </button>

                <button
                  type="button"
                  className="action-btn"
                  onClick={() => onRotate(img.id, 90)}
                  title="Rotate Clockwise"
                >
                  <RotateCw size={14} />
                </button>

                <button
                  type="button"
                  className="action-btn delete-action"
                  onClick={() => onRemove(img.id)}
                  title="Remove Image"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          );
        })}

        {/* Add More Card Slot */}
        <div className="add-more-card">
          <UploadZone onImagesSelected={onAddMoreImages} compact={true} />
        </div>
      </div>
    </div>
  );
};
