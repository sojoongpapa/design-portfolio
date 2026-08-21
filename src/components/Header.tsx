import React, { useState, useEffect } from 'react';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { Theme } from '../hooks/useTheme';

export type TabType = 'HOME' | 'PROJECTS' | 'ABOUT' | 'CONTACT';

interface HeaderProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  designerName: string;
  theme: Theme;
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  designerName,
  theme,
  onToggleTheme,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 모바일 메뉴 열렸을 때 배경 스크롤 잠금
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleNavClick = (tab: TabType) => {
    onTabChange(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const navItems: TabType[] = ['HOME', 'PROJECTS', 'ABOUT', 'CONTACT'];

  return (
    <>
      <header className={`site-header ${scrolled ? 'scrolled' : ''}`}>
        <div className="header-inner">
          {/* Brand Logo */}
          <button
            onClick={() => handleNavClick('HOME')}
            className="brand-logo"
            aria-label="Home"
          >
            <span className="brand-name">{designerName || 'CHOI JIN WON'}</span>
            <span className="brand-subtitle">Design Portfolio</span>
          </button>

          {/* Right Nav & Theme Switch */}
          <div className="header-right">
            {/* Desktop Navigation */}
            <nav className="nav-menu" aria-label="Main Navigation">
              {navItems.map((tab) => {
                const isActive = activeTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => handleNavClick(tab)}
                    className={`nav-link ${isActive ? 'active' : ''}`}
                  >
                    {tab}
                  </button>
                );
              })}
            </nav>

            {/* Theme Toggle Button */}
            <button
              onClick={onToggleTheme}
              className="theme-toggle-btn"
              title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
              aria-label="Toggle Theme Mode"
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="mobile-toggle"
              aria-label="Open Navigation Menu"
              aria-expanded={mobileMenuOpen}
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Fullscreen Menu Overlay */}
      {mobileMenuOpen && (
        <div className="mobile-fullscreen-overlay animate-fadeIn" role="dialog" aria-modal="true">
          {/* Top Bar inside Overlay */}
          <div className="mobile-overlay-header">
            <button
              onClick={() => handleNavClick('HOME')}
              className="brand-logo"
              aria-label="Home"
            >
              <span className="brand-name">{designerName || 'CHOI JIN WON'}</span>
              <span className="brand-subtitle">Design Portfolio</span>
            </button>

            <div className="mobile-overlay-actions">
              <button
                onClick={onToggleTheme}
                className="theme-toggle-btn"
                title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
                aria-label="Toggle Theme Mode"
              >
                {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
              </button>

              <button
                onClick={() => setMobileMenuOpen(false)}
                className="mobile-toggle mobile-close-btn"
                aria-label="Close Navigation Menu"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          {/* Centered Navigation Menu */}
          <div className="mobile-overlay-body">
            <nav className="mobile-fullscreen-nav" aria-label="Mobile Navigation">
              {navItems.map((tab, idx) => {
                const isActive = activeTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => handleNavClick(tab)}
                    className={`mobile-fullscreen-link ${isActive ? 'active' : ''}`}
                    style={{ animationDelay: `${(idx + 1) * 0.08}s` }}
                  >
                    <span className="mobile-link-text">{tab}</span>
                    {isActive && <span className="mobile-active-dot" />}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Bottom Footer inside Overlay */}
          <div className="mobile-overlay-footer">
            <p className="mobile-footer-text">
              © {new Date().getFullYear()} {designerName || 'CHOI JIN WON'}. All Rights Reserved.
            </p>
          </div>
        </div>
      )}
    </>
  );
};
