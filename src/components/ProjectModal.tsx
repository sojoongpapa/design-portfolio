import React, { useEffect, useState, useRef } from 'react';
import { ProjectItem } from '../types/portfolio';
import { X, ChevronLeft, ChevronRight, LayoutGrid, Calendar, Layers, ImageOff, ExternalLink, Globe } from 'lucide-react';

interface ProjectModalProps {
  project: ProjectItem;
  projects: ProjectItem[];
  onClose: () => void;
  onSelectProject: (project: ProjectItem) => void;
}

interface DetailImageItemProps {
  src: string;
  alt: string;
  index: number;
}

const DetailImageItem: React.FC<DetailImageItemProps> = ({ src, alt, index }) => {
  const [loaded, setLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const imageSrc = src?.trim();

  if (hasError || !imageSrc) {
    return (
      <div className="detail-empty-placeholder" style={{ padding: '36px 16px' }}>
        <ImageOff size={28} style={{ opacity: 0.35 }} />
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          이미지를 불러올 수 없습니다 (상세 이미지 {index + 1})
        </span>
      </div>
    );
  }

  return (
    <div className="detail-img-wrapper" style={{ position: 'relative', minHeight: loaded ? 'auto' : '160px' }}>
      {!loaded && !hasError && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(90deg, #15151a 0%, #202028 50%, #15151a 100%)',
            animation: 'pulse 1.5s infinite',
            borderRadius: 'var(--radius-md, 8px)',
            minHeight: '160px',
            zIndex: 1,
          }}
        />
      )}
      <img
        src={imageSrc}
        alt={alt}
        onLoad={() => setLoaded(true)}
        onError={() => setHasError(true)}
        className="detail-flow-img"
        style={{
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.3s ease-in-out',
          display: 'block',
          width: '100%',
          height: 'auto',
        }}
      />
    </div>
  );
};

export const ProjectModal: React.FC<ProjectModalProps> = ({
  project,
  projects,
  onClose,
  onSelectProject,
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  const currentIndex = projects.findIndex((p) => (project.id ? p.id === project.id : p === project));
  const prevProject = currentIndex > 0 ? projects[currentIndex - 1] : null;
  const nextProject = currentIndex >= 0 && currentIndex < projects.length - 1 ? projects[currentIndex + 1] : null;

  // 1. Lock background body scroll while modal is open
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // 2. Keyboard navigation listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && prevProject) onSelectProject(prevProject);
      if (e.key === 'ArrowRight' && nextProject) onSelectProject(nextProject);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose, prevProject, nextProject, onSelectProject]);

  // Reset scroll when switching project
  useEffect(() => {
    if (overlayRef.current) {
      overlayRef.current.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
      setIsScrolled(false);
    }
  }, [project.id, project.title]);

  // Determine list of detail images
  const detailList = (project.detailImages || []).filter((url) => typeof url === 'string' && url.trim() !== '');
  const fallbackSingle = project.image?.trim();

  const displayImages = detailList.length > 0
    ? detailList
    : (fallbackSingle ? [fallbackSingle] : []);

  const handleOverlayScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    setIsScrolled(scrollTop > 60);
  };

  return (
    <div
      className="project-detail-overlay"
      ref={overlayRef}
      onScroll={handleOverlayScroll}
      onClick={onClose}
    >
      <div className="project-detail-container" onClick={(e) => e.stopPropagation()}>
        {/* Sticky Control Bar with Dynamic Compact Title */}
        <div className={`detail-top-bar ${isScrolled ? 'has-scrolled-title' : ''}`}>
          <button
            onClick={onClose}
            className="detail-action-btn back-btn"
            aria-label="Back to project list"
          >
            <LayoutGrid size={16} />
            <span className="hide-mobile">PROJECT LIST</span>
          </button>

          {/* 1-Line Compact Title on Scroll */}
          <div className="detail-compact-title-wrap">
            <span className="detail-compact-badge">{project.category?.trim() || '미지정'}</span>
            <span className="detail-compact-title" title={project.title}>
              {project.title}
            </span>
          </div>

          <div className="detail-nav-group">
            <button
              disabled={!prevProject}
              onClick={() => prevProject && onSelectProject(prevProject)}
              className={`detail-action-btn ${!prevProject ? 'disabled' : ''}`}
              title={prevProject ? `Previous: ${prevProject.title}` : 'No previous project'}
              aria-label="Previous project"
            >
              <ChevronLeft size={18} />
              <span className="hide-mobile">PREV</span>
            </button>

            <span className="detail-page-counter">
              {currentIndex >= 0 ? currentIndex + 1 : 1} / {projects.length}
            </span>

            <button
              disabled={!nextProject}
              onClick={() => nextProject && onSelectProject(nextProject)}
              className={`detail-action-btn ${!nextProject ? 'disabled' : ''}`}
              title={nextProject ? `Next: ${nextProject.title}` : 'No next project'}
              aria-label="Next project"
            >
              <span className="hide-mobile">NEXT</span>
              <ChevronRight size={18} />
            </button>

            <button
              onClick={onClose}
              className="detail-close-btn"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Project Header Info (Rich multiple lines in natural flow) */}
        <header className="detail-header-section">
          <div className="detail-meta-row">
            <span className="detail-category-badge">
              <Layers size={13} />
              {project.category || 'Portfolio'}
            </span>
            {project.date && (
              <span className="detail-date-badge">
                <Calendar size={13} />
                {project.date}
              </span>
            )}
          </div>

          <h1 className="detail-main-title">{project.title}</h1>

          {project.caption && (
            <p className="detail-main-caption">{project.caption}</p>
          )}

          {project.link && project.link.trim() !== '' && (
            <div className="detail-link-action-wrap">
              <a
                href={project.link.trim()}
                target="_blank"
                rel="noopener noreferrer"
                className="detail-live-link-btn"
                aria-label={`${project.title} 웹사이트 새 창으로 열기`}
              >
                <Globe size={15} className="link-globe-icon" />
                <span>웹사이트 바로가기</span>
                <ExternalLink size={14} className="link-arrow-icon" />
              </a>
            </div>
          )}
        </header>

        {/* Detail Images Flow */}
        <div className="detail-images-container">
          <div className="detail-images-body">
            {displayImages.length > 0 ? (
              displayImages.map((imgUrl, idx) => (
                <DetailImageItem
                  key={`${project.id || project.title}-${idx}-${imgUrl}`}
                  src={imgUrl}
                  alt={`${project.title} - detail ${idx + 1}`}
                  index={idx}
                />
              ))
            ) : (
              <div className="detail-empty-placeholder">
                <ImageOff size={36} style={{ opacity: 0.3 }} />
                <p>No detail images available for this project.</p>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="detail-bottom-nav">
          <button
            onClick={onClose}
            className="btn-primary"
            style={{ margin: '0 auto' }}
          >
            <LayoutGrid size={16} />
            <span>Back to All Projects</span>
          </button>
        </div>
      </div>
    </div>
  );
};
