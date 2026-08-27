import React, { useState } from 'react';
import { YouTubeMediaItem } from '../utils/youtube';
import { Play, Smartphone, Video } from 'lucide-react';

interface YouTubePlayerItemProps {
  video: YouTubeMediaItem;
  index: number;
}

export const YouTubePlayerItem: React.FC<YouTubePlayerItemProps> = ({ video, index }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`detail-video-card ${video.isShorts ? 'is-shorts' : 'is-standard'}`}>
      {/* Video Header Badge */}
      <div className="detail-video-header">
        <span className={`detail-video-badge ${video.isShorts ? 'shorts-badge' : 'standard-badge'}`}>
          {video.isShorts ? (
            <>
              <Smartphone size={13} className="video-badge-icon" />
              <span>YouTube Shorts</span>
            </>
          ) : (
            <>
              <Video size={13} className="video-badge-icon" />
              <span>YouTube Video</span>
            </>
          )}
        </span>
      </div>

      {/* Video Frame Wrapper */}
      <div className={`detail-video-frame-wrap ${video.isShorts ? 'shorts-frame' : 'standard-frame'}`}>
        {!loaded && (
          <div className="detail-video-skeleton">
            <div className="skeleton-play-icon">
              <Play size={28} fill="currentColor" opacity={0.6} />
            </div>
            <span className="skeleton-text">영상을 불러오는 중입니다...</span>
          </div>
        )}
        <iframe
          src={video.embedUrl}
          title={`YouTube video player - ${index + 1}`}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          className="detail-video-iframe"
          onLoad={() => setLoaded(true)}
        />
      </div>
    </div>
  );
};

interface YouTubeMediaSectionProps {
  videos: YouTubeMediaItem[];
}

export const YouTubeMediaSection: React.FC<YouTubeMediaSectionProps> = ({ videos }) => {
  if (!videos || videos.length === 0) return null;

  // 일반 가로 영상(16:9)을 항상 상단에 먼저 배치하고, 숏츠 영상(9:16)을 하단에 배치
  const standardVideos = videos.filter((v) => !v.isShorts);
  const shortsVideos = videos.filter((v) => v.isShorts);

  let globalIndex = 0;

  return (
    <section className="detail-videos-container" aria-label="프로젝트 영상 목록">
      <div className="detail-videos-flow">
        {/* 1. 일반 와이드 영상 (상단 우선 배치) */}
        {standardVideos.length > 0 && (
          <div className="detail-videos-standard-list">
            {standardVideos.map((video) => {
              const currentIndex = globalIndex++;
              return (
                <YouTubePlayerItem
                  key={`${video.id}-${currentIndex}`}
                  video={video}
                  index={currentIndex}
                />
              );
            })}
          </div>
        )}

        {/* 2. 숏츠 영상 (하단 가로 3열 그리드 배치) */}
        {shortsVideos.length > 0 && (
          <div
            className={`detail-videos-shorts-grid ${shortsVideos.length === 1 ? 'is-single-shorts' : ''}`}
          >
            {shortsVideos.map((video) => {
              const currentIndex = globalIndex++;
              return (
                <YouTubePlayerItem
                  key={`${video.id}-${currentIndex}`}
                  video={video}
                  index={currentIndex}
                />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
