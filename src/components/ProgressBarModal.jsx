import React from 'react';
import { Sparkles } from 'lucide-react';

export const ProgressBarModal = ({ progress }) => {
  if (!progress) return null;

  const { current, total, percent } = progress;

  return (
    <div className="modal-backdrop progress-backdrop">
      <div className="progress-card">
        <div className="progress-header">
          <div className="progress-icon-wrapper">
            <Sparkles size={38} className="sparkle-icon spin" />
          </div>
          <h3>Generating High Quality PDF</h3>
          <p className="progress-subtitle">
            Processing page {current} of {total}...
          </p>
        </div>

        <div className="progress-bar-container">
          <div 
            className="progress-bar-fill" 
            style={{ width: `${percent}%` }}
          ></div>
        </div>

        <div className="progress-stats">
          <span>{percent}% Completed</span>
          <span>{current} / {total} Images</span>
        </div>
      </div>
    </div>
  );
};
