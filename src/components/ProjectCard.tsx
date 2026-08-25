import React, { useState } from 'react';
import { ProjectItem } from '../types/portfolio';
import { ImageOff, ArrowUpRight } from 'lucide-react';

interface ProjectCardProps {
  project: ProjectItem;
  onClick: (project: ProjectItem) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const imageSrc = project.image?.trim();

  return (
    <article
      onClick={() => onClick(project)}
      className="project-card"
      tabIndex={0}
      role="button"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(project);
        }
      }}
      aria-label={`${project.title} - view details`}
    >
      {/* Background Full Media Layer */}
      <div className="card-media-wrap">
        {/* Loading skeleton */}
        {!imageLoaded && !imageError && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(90deg, #15151a 0%, #202028 50%, #15151a 100%)',
              animation: 'pulse 1.5s infinite',
            }}
          />
        )}

        {imageSrc && !imageError ? (
          <img
            src={imageSrc}
            alt={project.alt || project.title}
            loading="lazy"
            decoding="async"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            className="card-img"
            style={{ opacity: imageLoaded ? 1 : 0 }}
          />
        ) : (
          <div className="card-placeholder">
            <ImageOff size={24} style={{ opacity: 0.4 }} />
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#a1a1aa' }}>
              {project.title}
            </span>
            <span style={{ fontSize: '0.65rem', color: '#71717a' }}>Image Pending</span>
          </div>
        )}
      </div>

      {/* Media Spacer to reserve 1:1 aspect ratio height naturally */}
      <div className="card-media-spacer" aria-hidden="true" />

      {/* Bottom Visible Details */}
      <div className="card-bottom-info">
        <h3 className="card-bottom-title">{project.title}</h3>
        <p className="card-bottom-caption">
          {project.caption || project.date || 'Design Project'}
        </p>
      </div>

      {/* Hover Overlay (Full Card) */}
      <div className="card-overlay">
        <div className="card-overlay-content">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span className="card-tag">
              {project.category?.trim() || '미지정'}
            </span>
            <div style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff'
            }}>
              <ArrowUpRight size={14} />
            </div>
          </div>

          <h3 className="card-title-hover">{project.title}</h3>

          {project.caption && (
            <p className="card-desc-hover">{project.caption}</p>
          )}
        </div>
      </div>
    </article>
  );
};
