import React, { useState, useEffect } from 'react';

interface IntroSplashProps {
  designerName: string;
  onFinish?: () => void;
}

export const IntroSplash: React.FC<IntroSplashProps> = ({ designerName, onFinish }) => {
  // 모바일 디바이스 또는 768px 이하 화면에서만 활성화
  const isMobileDevice = () => {
    if (typeof window === 'undefined') return false;
    const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isSmallScreen = window.innerWidth <= 768;
    return isMobileUA || isSmallScreen;
  };

  const [visible, setVisible] = useState(() => isMobileDevice());
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (!isMobileDevice()) {
      setVisible(false);
      return;
    }

    // 1.1초 후 스케일 업 / 줌 인 트랜지션 시작, 1.7초 후 완전 제거
    const fadeTimer = setTimeout(() => {
      setFading(true);
    }, 1100);

    const endTimer = setTimeout(() => {
      setVisible(false);
      if (onFinish) onFinish();
    }, 1700);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(endTimer);
    };
  }, [onFinish]);

  if (!visible) return null;

  return (
    <aside
      aria-label="App Splash Screen"
      className={fading ? 'splash-overlay-exit' : ''}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        backgroundColor: '#09090b',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        overflow: 'hidden',
        pointerEvents: fading ? 'none' : 'auto',
      }}
    >
      {/* Background Subtle Gradient Glow */}
      <div
        className={fading ? 'splash-glow-exit' : ''}
        style={{
          position: 'absolute',
          width: '320px',
          height: '320px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, rgba(0,0,0,0) 70%)',
          top: '45%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
        }}
      />

      <div
        className={`splash-center-content ${fading ? 'splash-zoom-exit' : 'splash-enter'}`}
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px',
          transformOrigin: 'center center',
          willChange: 'transform, opacity, filter',
        }}
      >
        {/* Profile Card with Watermark */}
        <div
          style={{
            position: 'relative',
            width: '180px',
            height: '216px',
            borderRadius: '24px',
            overflow: 'hidden',
            boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.1)',
            backgroundColor: '#18181b',
          }}
        >
          <img
            src="./images/about/photo-profile-watermarked.webp"
            alt={designerName}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
            onError={(e) => {
              // fallback to png
              const target = e.currentTarget;
              if (target.src.endsWith('.webp')) {
                target.src = './images/about/photo-profile-watermarked.png';
              }
            }}
          />
        </div>

        {/* Title & Brand */}
        <div style={{ textAlign: 'center' }}>
          <p
            style={{
              fontSize: '0.75rem',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: 'rgba(255, 255, 255, 0.5)',
              margin: '0 0 4px 0',
              fontWeight: 500,
            }}
          >
            PORTFOLIO
          </p>
          <h1
            style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: '#fafafa',
              margin: 0,
            }}
          >
            {designerName}
          </h1>
        </div>

        {/* Mini Loading Bar */}
        <div
          style={{
            width: '48px',
            height: '2px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '2px',
            overflow: 'hidden',
            marginTop: '8px',
            opacity: fading ? 0 : 1,
            transition: 'opacity 0.2s ease',
          }}
        >
          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              animation: 'splashProgress 1.1s ease-in-out forwards',
            }}
          />
        </div>
      </div>

      <style>{`
        @media (min-width: 769px) {
          aside[aria-label="App Splash Screen"] {
            display: none !important;
          }
        }

        .splash-enter {
          animation: splashCardIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        /* Scale Up / Zoom In exit transition */
        .splash-zoom-exit {
          animation: splashZoomInExit 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        .splash-overlay-exit {
          animation: splashBgExit 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .splash-glow-exit {
          animation: splashGlowExit 0.6s ease-out forwards;
        }

        @keyframes splashCardIn {
          from {
            opacity: 0;
            transform: scale(0.92) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes splashZoomInExit {
          0% {
            opacity: 1;
            transform: scale(1);
            filter: blur(0px);
          }
          30% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: scale(2.4);
            filter: blur(12px);
          }
        }

        @keyframes splashBgExit {
          0% {
            opacity: 1;
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }

        @keyframes splashGlowExit {
          0% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(2.5);
          }
        }

        @keyframes splashProgress {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </aside>
  );
};
