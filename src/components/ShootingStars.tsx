import React from 'react';

interface ShootingStarConfig {
  id: number;
  top: string;
  left: string;
  width: string;
  angle: string;
  delay: string;
  duration: string;
}

interface TwinkleStarConfig {
  id: number;
  top: string;
  left: string;
  size: string;
  delay: string;
  duration: string;
  color?: string;
}

// 갯수와 빈도를 대폭 줄여 가끔씩 최상단에서 우아하게 가로지르는 2개의 별똥별
const SHOOTING_STARS: ShootingStarConfig[] = [
  { id: 1, top: '-40px', left: '16%', width: '190px', angle: '35deg', delay: '2s', duration: '18s' },
  { id: 2, top: '-25px', left: '68%', width: '220px', angle: '42deg', delay: '10s', duration: '22s' },
];

// 브라우저 최상단(헤더 뒤편)부터 본문 전체에 은은하게 반짝이는 밤하늘 별들
const TWINKLE_STARS: TwinkleStarConfig[] = [
  { id: 1, top: '3%', left: '8%', size: '2px', delay: '0.2s', duration: '3.1s' },
  { id: 2, top: '6%', left: '28%', size: '2.5px', delay: '1.4s', duration: '4.2s', color: 'rgba(229, 184, 105, 0.9)' },
  { id: 3, top: '4%', left: '76%', size: '2px', delay: '0.8s', duration: '2.8s' },
  { id: 4, top: '8%', left: '92%', size: '2.5px', delay: '1.8s', duration: '3.6s', color: 'rgba(229, 184, 105, 0.85)' },
  { id: 5, top: '16%', left: '18%', size: '2px', delay: '0.5s', duration: '3.4s' },
  { id: 6, top: '24%', left: '46%', size: '3px', delay: '2.1s', duration: '4.0s', color: 'rgba(229, 184, 105, 0.9)' },
  { id: 7, top: '20%', left: '64%', size: '2px', delay: '1.1s', duration: '3.2s' },
  { id: 8, top: '34%', left: '84%', size: '2.5px', delay: '0.9s', duration: '4.2s' },
  { id: 9, top: '38%', left: '32%', size: '2px', delay: '2.7s', duration: '3.5s' },
];

export const ShootingStars: React.FC = () => {
  return (
    <div className="shooting-stars-wrapper" aria-hidden="true">
      {/* Background Twinkling Stars */}
      {TWINKLE_STARS.map((star) => (
        <span
          key={`twinkle-${star.id}`}
          className="twinkle-star"
          style={
            {
              top: star.top,
              left: star.left,
              '--size': star.size,
              '--delay': star.delay,
              '--duration': star.duration,
              '--color': star.color || '#ffffff',
            } as React.CSSProperties
          }
        />
      ))}

      {/* Meteors / Shooting Stars (Very Rare & Elegant) */}
      {SHOOTING_STARS.map((star) => (
        <span
          key={`shooting-${star.id}`}
          className="shooting-star"
          style={
            {
              top: star.top,
              left: star.left,
              '--target-width': star.width,
              '--angle': star.angle,
              '--delay': star.delay,
              '--duration': star.duration,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
};

export default ShootingStars;
