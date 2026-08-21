import React from 'react';
import { ArrowUp } from 'lucide-react';

interface FooterProps {
  designerName: string;
}

export const Footer: React.FC<FooterProps> = ({ designerName }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div>
          © {new Date().getFullYear()} {designerName || 'CHOI JIN WON'}. All Rights Reserved.
        </div>

        <button onClick={scrollToTop} className="btn-back-to-top">
          <span>Back to Top</span>
          <ArrowUp size={14} />
        </button>
      </div>
    </footer>
  );
};
