import React from 'react';
import { X, RotateCw, RotateCcw, Image as ImageIcon } from 'lucide-react';

export const ImageModal = ({ image, onClose, onRotate }) => {
  if (!image) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <ImageIcon size={18} />
            <span>{image.name}</span>
          </div>
          <div className="modal-actions">
            <button
              type="button"
              className="modal-icon-btn"
              onClick={() => onRotate(image.id, -90)}
              title="Rotate Left"
            >
              <RotateCcw size={16} />
            </button>
            <button
              type="button"
              className="modal-icon-btn"
              onClick={() => onRotate(image.id, 90)}
              title="Rotate Right"
            >
              <RotateCw size={16} />
            </button>
            <button
              type="button"
              className="modal-icon-btn close-btn"
              onClick={onClose}
              title="Close Preview"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="modal-body">
          <img
            src={image.url}
            alt={image.name}
            className="modal-preview-img"
            style={{
              transform: `rotate(${image.rotation || 0}deg)`
            }}
          />
        </div>
      </div>
    </div>
  );
};
