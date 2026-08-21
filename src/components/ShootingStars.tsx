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

// 갯수와 빈도를 1/10로 대폭 줄여 아주 가끔씩 떨어지는 우아한 2개의 별똥별
const SHOOTING_STARS: ShootingStarConfig[] = [
  { id: 1, top: '-20px', left: '18%', width: '180px', angle: '36deg', delay: '2s', duration: '18s' },
  { id: 2, top: '10px', left: '72%', width: '200px', angle: '44deg', delay: '11s', duration: '24s' },
];

// 브라우저 가로 전체에 은은하게 반짝이는 밤하늘 별들
const TWINKLE_STARS: TwinkleStarConfig[] = [
  { id: 1, top: '12%', left: '6%', size: '2px', delay: '0.2s', duration: '3.1s' },
  { id: 2, top: '24%', left: '16%', size: '2.5px', delay: '1.4s', duration: '4.2s', color: 'rgba(229, 184, 105, 0.9)' },
  { id: 3, top: '14%', left: '30%', size: '2px', delay: '0.8s', duration: '2.8s' },
  { id: 4, top: '36%', left: '42%', size: '3px', delay: '1.9s', duration: '3.9s', color: 'rgba(229, 184, 105, 0.85)' },
  { id: 5, top: '18%', left: '52%', size: '2.5px', delay: '0.5s', duration: '3.6s' },
  { id: 6, top: '40%', left: '64%', size: '2px', delay: '2.7s', duration: '3.2s' },
  { id: 7, top: '10%', left: '78%', size: '2.5px', delay: '1.1s', duration: '3.8s' },
  { id: 8, top: '32%', left: '88%', size: '3px', delay: '0.9s', duration: '4.2s', color: 'rgba(229, 184, 105, 0.9)' },
  { id: 9, top: '16%', left: '95%', size: '2px', delay: '2.1s', duration: '3.3s' },
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
