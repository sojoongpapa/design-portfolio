import React, { useMemo, useState, useEffect } from 'react';
import {
  Sparkles,
  ArrowRight,
  Compass,
  Zap,
  ShieldCheck,
  ChevronRight,
  ImageOff,
} from 'lucide-react';
import { ProfileInfo, AboutInfo, ProjectItem } from '../types/portfolio';
import { TabType } from './Header';
import { ProjectCard } from './ProjectCard';
import { ShootingStars } from './ShootingStars';
import { Theme } from '../hooks/useTheme';

interface HomeSectionProps {
  profile: ProfileInfo;
  about: AboutInfo;
  projects: ProjectItem[];
  theme?: Theme;
  onNavigate: (tab: TabType) => void;
  onSelectProject: (project: ProjectItem, contextProjects?: ProjectItem[]) => void;
}

const parseProjectDate = (d?: string) => {
  if (!d) return 0;
  // "Jul 8,2026" -> "Jul 8, 2026" (쉼표 뒤 공백 보정)
  const normalized = d.replace(/,(\S)/, ', $1');
  const time = Date.parse(normalized);
  return isNaN(time) ? 0 : time;
};

const HEADLINE_SEGMENTS = [
  { text: 'Where ', className: 'headline-text' },
  { text: 'Aesthetics', className: 'text-em-italic' },
  { text: ' Meet ', className: 'headline-text' },
  { text: 'Precision', className: 'text-em-gradient' },
  { text: '.', className: 'headline-dot' },
];

const TypewriterHeadline: React.FC = () => {
  const fullLength = useMemo(
    () => HEADLINE_SEGMENTS.reduce((acc, curr) => acc + curr.text.length, 0),
    []
  );
  const [charCount, setCharCount] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    let index = 0;
    setCharCount(0);
    setIsCompleted(false);

    const timer = setInterval(() => {
      index += 1;
      setCharCount(index);
      if (index >= fullLength) {
        clearInterval(timer);
        setIsCompleted(true);
      }
    }, 55);

    return () => clearInterval(timer);
  }, [fullLength]);

  let remaining = charCount;

  return (
    <span className={`hero-line-main typewriter-headline ${isCompleted ? 'typing-finished' : ''}`}>
      {HEADLINE_SEGMENTS.map((segment, sIdx) => {
        if (remaining <= 0) return null;
        const sliceLen = Math.min(remaining, segment.text.length);
        const visibleSlice = segment.text.slice(0, sliceLen);
        remaining -= sliceLen;

        return (
          <span key={sIdx} className={segment.className}>
            {visibleSlice}
          </span>
        );
      })}
      <span className={`typing-cursor ${isCompleted ? 'completed' : ''}`} aria-hidden="true" />
    </span>
  );
};

const SpotlightMedia: React.FC<{ project: ProjectItem }> = ({ project }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const imageSrc = project.image?.trim();

  return (
    <div className="spotlight-media-container">
      {/* Loading skeleton */}
      {!imageLoaded && !imageError && imageSrc && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(90deg, rgba(120, 120, 140, 0.08) 0%, rgba(120, 120, 140, 0.16) 50%, rgba(120, 120, 140, 0.08) 100%)',
            animation: 'pulse 1.5s infinite',
            zIndex: 1,
          }}
        />
      )}

      {imageSrc && !imageError ? (
        <img
          src={imageSrc}
          alt={project.alt || project.title}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
          style={{ opacity: imageLoaded ? 1 : 0 }}
        />
      ) : (
        <div className="spotlight-placeholder">
          <ImageOff size={36} className="spotlight-placeholder-icon" />
          <span className="spotlight-placeholder-title">{project.title}</span>
          <span className="spotlight-placeholder-subtitle">Image Pending</span>
        </div>
      )}
      <div className="spotlight-media-gradient" />
    </div>
  );
};

const defaultTickerKeywords = [
  'UI / UX DESIGN',
  'CREATIVE DIRECTION',
  'INTERACTIVE WEB',
  'BRAND IDENTITY',
  'DESIGN SYSTEMS',
  'FRONTEND CRAFT',
  'DIGITAL STRATEGY',
  '20+ YEARS CRAFT',
];

const defaultDesignPillars = [
  {
    num: '01',
    title: 'Clarity & Pure Purpose',
    subtitle: '본질에 집중하는 구조적 명확함',
    desc: '불필요한 시각적 장식을 배제하고 본질에 집중합니다. 사용자의 직관적인 여정과 브랜드의 핵심 가치가 왜곡 없이 전달되는 최적의 구조를 설계합니다.',
    icon: 'Compass',
  },
  {
    num: '02',
    title: 'Kinetic Emotion & Detail',
    subtitle: '감각을 깨우는 정교한 인터랙션',
    desc: '섬세한 마이크로 인터랙션과 반응형 모션으로 정적인 화면에 생명력을 불어넣고, 사용자와 디지털 제품 간의 깊은 정서적 교감을 이끌어냅니다.',
    icon: 'Zap',
  },
  {
    num: '03',
    title: 'Scalable Craftsmanship',
    subtitle: '20년의 실무로 완성된 견고한 확장성',
    desc: '기획 의도 분석부터 하이엔드 비주얼 아트워크, 웹 표준 코드 구현까지 20년간 축적된 실무 경험으로 타협 없는 완성도를 보장합니다.',
    icon: 'ShieldCheck',
  },
  {
    num: '04',
    title: 'AI & Experience Synergy',
    subtitle: '실무 경험과 AI의 유기적 결합',
    desc: '수많은 실무 경험과 최신 AI 도구를 유기적으로 결합하여, 빠르고 정확하며 완성도 높은 디지털 결과물을 제작합니다.',
    icon: 'Sparkles',
  },
];

const getPillarIcon = (iconName?: string) => {
  switch (iconName?.toLowerCase()) {
    case 'compass':
      return Compass;
    case 'zap':
      return Zap;
    case 'shieldcheck':
    case 'shield':
      return ShieldCheck;
    case 'sparkles':
    default:
      return Sparkles;
  }
};

export const HomeSection: React.FC<HomeSectionProps> = ({
  profile,
  about,
  projects,
  theme = 'light',
  onNavigate,
  onSelectProject,
}) => {
  // main에 숫자가 지정된 프로젝트만 필터링 후 숫자 오름차순(1, 2, 3...) 정렬
  const mainProjects = useMemo(() => {
    return projects
      .filter((p): p is ProjectItem & { main: number } => typeof p.main === 'number' && !isNaN(p.main))
      .sort((a, b) => {
        if (a.main !== b.main) {
          return a.main - b.main;
        }
        // main 번호가 동일할 경우 날짜 최신순 정렬
        const timeA = parseProjectDate(a.date);
        const timeB = parseProjectDate(b.date);
        if (timeB !== timeA) return timeB - timeA;
        return projects.indexOf(a) - projects.indexOf(b);
      });
  }, [projects]);

  // 첫 번째 프로젝트: 대형 스포트라이트 카드 (없으면 null)
  const heroFeaturedProject = mainProjects[0] || null;

  // 두 번째 이후 프로젝트들: 하단 서브 그리드에 동적으로 노출 (0개 ~ N개)
  const secondaryFeaturedProjects = useMemo(() => {
    return mainProjects.slice(1);
  }, [mainProjects]);

  const tickerKeywords =
    profile.tickerKeywords && profile.tickerKeywords.length > 0
      ? profile.tickerKeywords
      : defaultTickerKeywords;

  const designPillars =
    profile.designPillars && profile.designPillars.length > 0
      ? profile.designPillars
      : defaultDesignPillars;

  return (
    <div className="home-container animate-fadeIn">
      {/* 1. DESIGNER EDITORIAL HERO SECTION (상단부터 Marquee 바로 위까지) */}
      <section className="designer-hero-section">
        {/* Ambient Visual Backdrops (Hero Section Boundary) */}
        <div className="hero-visual-backdrop" aria-hidden="true">
          <div className="hero-aurora-blob hero-aurora-1" />
          <div className="hero-aurora-blob hero-aurora-2" />
          <div className="hero-grid-mesh" />
          {theme === 'dark' && <ShootingStars />}
        </div>

        <div className="designer-hero-grid">
          {/* Left Column: Editorial Typography & Persona */}
          <div className="designer-hero-left">
            <div className="hero-meta-pill-group">
              <span className="designer-badge-tag">
                <Sparkles size={13} className="sparkle-pulse" />
                {profile.role || 'Senior Digital & Web Designer'}
              </span>
              <span className="availability-tag">
                <span className="live-pulse-dot" />
                Available for Selected Projects
              </span>
            </div>

            <h1 className="designer-hero-headline">
              <span className="hero-line-sub">Creative Direction & Visual Web Craft</span>
              <TypewriterHeadline />
            </h1>

            <p className="designer-hero-statement">
              {profile.bio ||
                '디자인의 본질과 직관적인 사용자 경험, 웹 표준 기술을 융합하여 20년간 수많은 브랜드의 가치를 시각화해 온 웹 & 디지털 디자이너 최진원입니다.'}
            </p>

            {/* Quick Actions */}
            <div className="designer-hero-actions">
              <button
                onClick={() => onNavigate('PROJECTS')}
                className="designer-btn primary"
                aria-label="Explore all projects"
              >
                <span>Explore All Works ({projects.length})</span>
                <ArrowRight size={16} />
              </button>
              <button
                onClick={() => onNavigate('ABOUT')}
                className="designer-btn secondary"
                aria-label="About the designer"
              >
                <span>About Atelier</span>
              </button>
              <button
                onClick={() => onNavigate('CONTACT')}
                className="designer-btn ghost"
                aria-label="Contact designer"
              >
                <span>Get in Touch</span>
              </button>
            </div>

            {/* Editorial Quick Index Strip (Replacing clunky SaaS metric boxes) */}
            <div className="designer-editorial-index">
              <div className="editorial-index-item" onClick={() => onNavigate('PROJECTS')}>
                <span className="index-num">{projects.length}+</span>
                <span className="index-label">Curated Projects</span>
              </div>
              <span className="index-divider">/</span>
              <div className="editorial-index-item" onClick={() => onNavigate('ABOUT')}>
                <span className="index-num">20+</span>
                <span className="index-label">Years of Craft</span>
              </div>
              <span className="index-divider">/</span>
              <div className="editorial-index-item" onClick={() => onNavigate('ABOUT')}>
                <span className="index-num">{about.clients?.length || 39}+</span>
                <span className="index-label">Brand Partnerships</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. INFINITE TICKER STRIP (브라우저 가로 100% 영역) */}
      <section className="marquee-section" aria-hidden="true">
        <div className="marquee-track">
          <div className="marquee-content">
            {tickerKeywords.concat(tickerKeywords).map((keyword, idx) => (
              <span key={idx} className="marquee-item">
                <span className="marquee-bullet">✦</span>
                {keyword}
              </span>
            ))}
          </div>
          <div className="marquee-content" aria-hidden="true">
            {tickerKeywords.concat(tickerKeywords).map((keyword, idx) => (
              <span key={`dup-${idx}`} className="marquee-item">
                <span className="marquee-bullet">✦</span>
                {keyword}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 3. CURATED FEATURED WORKS (Cinematic Spotlight + Asymmetrical Grid) */}
      {mainProjects.length > 0 && (
        <section className="home-featured-section">
          <div className="section-header-row">
            <div>
              <div className="section-eyebrow">
                <Sparkles size={13} style={{ color: 'var(--accent-gold)' }} />
                <span>CURATED HIGHLIGHTS</span>
              </div>
              <h2 className="section-main-title">Project Works & Portfolio</h2>
              <p className="section-sub-desc">
                20년간 제작된 다양한 프로젝트 목록입니다.
              </p>
            </div>
            <button
              onClick={() => onNavigate('PROJECTS')}
              className="view-all-link-btn"
              aria-label="View all projects"
            >
              <span>전체 {projects.length}개 프로젝트 탐색</span>
              <ChevronRight size={16} />
            </button>
          </div>

          {/* 3-A. Featured Hero Spotlight Card */}
          {heroFeaturedProject && (
            <div
              className="cinematic-spotlight-card"
              onClick={() => onSelectProject(heroFeaturedProject, projects)}
            >
              <SpotlightMedia project={heroFeaturedProject} />
              <div className="spotlight-content-box">
                <div className="spotlight-meta-line">
                  <span className="spotlight-badge">FEATURED PROJECT</span>
                  <span className="spotlight-category">{heroFeaturedProject.category}</span>
                  {heroFeaturedProject.date && (
                    <span className="spotlight-date">{heroFeaturedProject.date}</span>
                  )}
                </div>
                <h3 className="spotlight-title">{heroFeaturedProject.title}</h3>
                <p className="spotlight-desc">{heroFeaturedProject.caption}</p>
                <div className="spotlight-link">
                  <span>프로젝트 상세 보기</span>
                  <ArrowRight size={16} className="spotlight-arrow" />
                </div>
              </div>
            </div>
          )}

          {/* 3-B. Secondary Featured Projects Grid */}
          {secondaryFeaturedProjects.length > 0 && (
            <div className="project-grid secondary-grid">
              {secondaryFeaturedProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onClick={(p) => onSelectProject(p, projects)}
                />
              ))}
            </div>
          )}

          <div className="showcase-bottom-cta">
            <button
              onClick={() => onNavigate('PROJECTS')}
              className="designer-btn primary large"
            >
              <span>전체 {projects.length}개 프로젝트 모두 탐색하기</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </section>
      )}

      {/* 5. CLIENT COLLABORATIONS & TRUST STRIP */}
      {about.clients && about.clients.length > 0 && (
        <section className="home-clients-section">
          <div className="clients-header">
            <span className="clients-title-tag">Clients & Partnerships</span>
            <h3 className="clients-subheading">20년간 함께 가치를 만들어온 파트너</h3>
          </div>
          <div className="clients-chips-wall">
            {about.clients.map((client, idx) => (
              <div key={idx} className="client-chip">
                <span className="chip-dot" />
                <span className="chip-name">{client}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. DESIGN MANIFESTO & PHILOSOPHY (Editorial Layout) */}
      <section className="home-manifesto-section">
        <div className="manifesto-inner-grid">
          <div className="manifesto-lead">
            <div className="section-eyebrow">
              <span>DESIGN MANIFESTO</span>
            </div>
            <h2 className="manifesto-big-title">
              Crafting with <br />
              <span className="text-em-italic">Purpose & Elegance.</span>
            </h2>
            <p className="manifesto-summary">
              단순히 보기 좋은 그래픽을 넘어, 비즈니스의 목표와 사용자의 심리를 관통하는
              디지털 인터페이스를 만듭니다.
            </p>
          </div>

          <div className="manifesto-list">
            {designPillars.map((pillar) => {
              const Icon = getPillarIcon(pillar.icon);
              return (
                <div key={pillar.num} className="manifesto-item">
                  <div className="manifesto-item-header">
                    <span className="manifesto-num">{pillar.num}</span>
                    <div className="manifesto-item-title-wrap">
                      <h3 className="manifesto-title">{pillar.title}</h3>
                      {pillar.subtitle && (
                        <span className="manifesto-subtitle">{pillar.subtitle}</span>
                      )}
                    </div>
                    <div className="manifesto-icon-box">
                      <Icon size={18} />
                    </div>
                  </div>
                  <p className="manifesto-desc">{pillar.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};


