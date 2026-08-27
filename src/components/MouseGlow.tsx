import React, { useEffect, useRef, useState } from 'react';
import { Theme } from '../hooks/useTheme';

interface MouseGlowProps {
  theme?: Theme;
}

export const MouseGlow: React.FC<MouseGlowProps> = () => {
  const glowRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let targetX = window.innerWidth / 2;
    let targetY = 200;
    let currentX = targetX;
    let currentY = targetY;
    let targetScale = 1.0;
    let currentScale = 1.0;
    let idleTimer: NodeJS.Timeout | null = null;
    let animationFrameId: number;

    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      if (glowRef.current && glowRef.current.parentElement) {
        const rect = glowRef.current.parentElement.getBoundingClientRect();
        targetX = e.clientX - rect.left;
        targetY = e.clientY - rect.top;
      } else {
        targetX = e.clientX;
        targetY = e.clientY;
      }
      setIsVisible(true);

      // 움직이는 동안에는 기본 크기(0.85)로 날렵하게 유지
      targetScale = 0.85;

      if (idleTimer) clearTimeout(idleTimer);
      // 커서가 160ms 동안 멈추면 영역 전체(3.0배, 약 1850px)로 서서히 웅장하게 번져나감 (Deep Full Bloom)
      idleTimer = setTimeout(() => {
        targetScale = 3.0;
      }, 160);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
      targetScale = 1.0;
      if (idleTimer) clearTimeout(idleTimer);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    // 부드러운 관성(Lerp) 위치 & 스케일 애니메이션 루프
    const updatePosition = () => {
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;
      // 팽창할 때는 은은하게(0.032), 축소될 때는 부드럽게(0.055) 물방울처럼 반응
      const lerpSpeed = targetScale > currentScale ? 0.032 : 0.055;
      currentScale += (targetScale - currentScale) * lerpSpeed;

      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%) scale(${currentScale})`;
      }

      animationFrameId = requestAnimationFrame(updatePosition);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    animationFrameId = requestAnimationFrame(updatePosition);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      if (idleTimer) clearTimeout(idleTimer);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      ref={glowRef}
      className={`hero-mouse-glow ${isVisible ? 'visible' : ''}`}
      aria-hidden="true"
    />
  );
};

export default MouseGlow;
