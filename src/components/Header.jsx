import React from 'react';
import { FileImage, Sparkles, ShieldCheck, Zap } from 'lucide-react';

export const Header = () => {
  return (
    <header className="header-container">
      <div className="header-content">
        <div className="brand-logo">
          <div className="logo-icon-wrapper">
            <FileImage className="logo-icon" size={28} />
          </div>
          <div>
            <div className="brand-title">
              Image<span className="gradient-text">2</span>PDF Pro
              <span className="badge-pro">
                <Sparkles size={12} /> HIGH RES
              </span>
            </div>
            <p className="brand-subtitle">
              Convert multiple images into a single high-quality PDF in exact sequence
            </p>
          </div>
        </div>

        <div className="header-badges">
          <div className="feature-pill">
            <Zap size={14} className="accent-icon" />
            <span>Instant Processing</span>
          </div>
          <div className="feature-pill">
            <ShieldCheck size={14} className="success-icon" />
            <span>100% Private (Local)</span>
          </div>
        </div>
      </div>
    </header>
  );
};
