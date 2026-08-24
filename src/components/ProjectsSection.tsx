import React, { useState, useMemo } from 'react';
import { ProjectItem } from '../types/portfolio';
import { ProjectCard } from './ProjectCard';
import { Search, Layers, Filter, X } from 'lucide-react';

interface ProjectsSectionProps {
  projects: ProjectItem[];
  onSelectProject: (project: ProjectItem, contextProjects?: ProjectItem[]) => void;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  projects,
  onSelectProject,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [visibleCount, setVisibleCount] = useState(24);

  // 카테고리 명칭 정규화 (빈 값은 '미지정'으로 표기)
  const getCategoryLabel = (cat?: string) => {
    if (!cat || !cat.trim()) return '미지정';
    return cat.trim();
  };

  // 카테고리 목록 추출
  const categories = useMemo(() => {
    const cats = new Set<string>();
    projects.forEach((p) => {
      const label = getCategoryLabel(p.category);
      if (label.toUpperCase() !== 'ALL') {
        cats.add(label);
      }
    });

    // ALL을 맨 앞에, 미지정은 맨 뒤 또는 정렬 순서대로 배치
    const sortedCats = Array.from(cats).sort((a, b) => {
      if (a === '미지정') return 1;
      if (b === '미지정') return -1;
      return a.localeCompare(b, 'ko');
    });

    return ['ALL', ...sortedCats];
  }, [projects]);

  // 필터링 적용
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const projectCat = getCategoryLabel(p.category);
      const matchCat =
        selectedCategory === 'ALL' ||
        projectCat.toLowerCase() === selectedCategory.toLowerCase();

      if (!matchCat) return false;

      if (!searchQuery.trim()) return true;
      const query = searchQuery.toLowerCase().trim();
      return (
        p.title?.toLowerCase().includes(query) ||
        p.caption?.toLowerCase().includes(query) ||
        projectCat.toLowerCase().includes(query)
      );
    });
  }, [projects, selectedCategory, searchQuery]);

  const visibleProjects = filteredProjects.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProjects.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 24, filteredProjects.length));
  };

  const handleResetFilters = () => {
    setSelectedCategory('ALL');
    setSearchQuery('');
    setVisibleCount(24);
  };


  return (
    <div className="projects-page animate-fadeIn">
      {/* Editorial Page Header */}
      <div className="projects-header-block">
        <div className="projects-header-meta">
          <span className="projects-archive-pill">
            <Layers size={13} style={{ color: 'var(--accent-gold)' }} />
            <span>ALL PROJECTS</span>
          </span>
          <span className="projects-total-count">{projects.length} Curated Works</span>
        </div>
        <h1 className="projects-page-title">Project Works & Portfolio</h1>
        <p className="projects-page-desc">
          웹 사이트, 디지털 프로모션, 인터랙티브 솔루션 등 지난 20년간 제작된 다양한 프로젝트를 카테고리별로 탐색해보세요.
        </p>
      </div>

      {/* Category Pills & Filter Strip */}
      <div className="category-filter-strip">
        <div className="filter-pill-list">
          {categories.map((cat) => {
            const count =
              cat === 'ALL'
                ? projects.length
                : projects.filter((p) => getCategoryLabel(p.category).toLowerCase() === cat.toLowerCase()).length;
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setVisibleCount(24);
                }}
                className={`filter-pill-btn ${isActive ? 'active' : ''}`}
              >
                <span>{cat}</span>
                <span className="pill-count">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Controls Bar: Results Counter & Search */}
      <div className="controls-bar">
        <div className="counter-badge">
          <Filter size={14} style={{ color: 'var(--accent-gold)' }} />
          <span>
            Showing <strong>{visibleProjects.length}</strong> of <strong>{filteredProjects.length}</strong> Works
            {selectedCategory !== 'ALL' && ` in [${selectedCategory}]`}
          </span>
        </div>

        {/* Search Bar */}
        <div className="search-wrapper">
          <Search size={15} className="search-icon" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setVisibleCount(24);
            }}
            placeholder="제목, 키워드, 카테고리 검색..."
            className="search-input"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="search-clear-btn"
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Projects Grid */}
      {visibleProjects.length > 0 ? (
        <div className="project-grid">
          {visibleProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={(p) => onSelectProject(p, filteredProjects)}
            />
          ))}
        </div>
      ) : (
        <div className="no-results-box">
          <p className="no-results-text">
            일치하는 프로젝트를 찾을 수 없습니다.
          </p>
          <button onClick={handleResetFilters} className="home-btn secondary" style={{ marginTop: 16 }}>
            <span>필터 초기화</span>
          </button>
        </div>
      )}

      {/* Load More Button */}
      {hasMore && (
        <div className="load-more-wrap">
          <button onClick={handleLoadMore} className="btn-primary">
            <span>더 많은 프로젝트 불러오기 ({filteredProjects.length - visibleCount}개 남음)</span>
          </button>
        </div>
      )}
    </div>
  );
};
