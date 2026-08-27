import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { usePortfolio } from './hooks/usePortfolio';
import { useTheme } from './hooks/useTheme';
import { Header, TabType } from './components/Header';
import { HomeSection } from './components/HomeSection';
import { ProjectsSection } from './components/ProjectsSection';
import { ProjectModal } from './components/ProjectModal';
import { AboutSection } from './components/AboutSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { IntroSplash } from './components/IntroSplash';
import { ProjectItem } from './types/portfolio';

const TAB_ORDER: TabType[] = ['HOME', 'PROJECTS', 'ABOUT', 'CONTACT'];

const getTabFromPath = (pathname: string): TabType => {
  const cleanPath = pathname.replace(/\/+$/, '') || '/';
  if (cleanPath.startsWith('/projects') || cleanPath.startsWith('/project/')) return 'PROJECTS';
  if (cleanPath.startsWith('/about')) return 'ABOUT';
  if (cleanPath.startsWith('/contact')) return 'CONTACT';
  return 'HOME';
};

const getPathFromTab = (tab: TabType): string => {
  switch (tab) {
    case 'HOME':
      return '/';
    case 'PROJECTS':
      return '/projects';
    case 'ABOUT':
      return '/about';
    case 'CONTACT':
      return '/contact';
    default:
      return '/';
  }
};

export const App: React.FC = () => {
  const { data, loading } = usePortfolio();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const currentTabFromUrl = getTabFromPath(location.pathname);
  const [activeTab, setActiveTab] = useState<TabType>(currentTabFromUrl);
  const [targetTab, setTargetTab] = useState<TabType | null>(null);
  const [flipDirection, setFlipDirection] = useState<'right' | 'left'>('right');
  const [flipPhase, setFlipPhase] = useState<'idle' | 'out' | 'in'>('idle');

  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [modalProjects, setModalProjects] = useState<ProjectItem[]>([]);

  // 초기 렌더링 여부 추적
  const isInitialMount = useRef(true);

  // URL 변경 감지하여 탭 애니메이션 및 활성 탭 동기화
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      setActiveTab(currentTabFromUrl);
      return;
    }

    if (currentTabFromUrl !== activeTab && flipPhase === 'idle') {
      const currentIndex = TAB_ORDER.indexOf(activeTab);
      const targetIndex = TAB_ORDER.indexOf(currentTabFromUrl);
      setFlipDirection(targetIndex >= currentIndex ? 'right' : 'left');
      setTargetTab(currentTabFromUrl);
      setFlipPhase('out');
    }
  }, [currentTabFromUrl, activeTab, flipPhase]);

  // URL에서 /project/:id 감지하여 모달 열기/닫기 동기화
  useEffect(() => {
    if (!data || !data.projects || data.projects.length === 0) return;

    const match = location.pathname.match(/^\/project\/([^/]+)/);
    if (match) {
      const rawId = decodeURIComponent(match[1]);
      const found = data.projects.find(
        (p) =>
          String(p.id) === rawId ||
          p.title === rawId ||
          encodeURIComponent(String(p.id ?? '')) === rawId
      );
      if (found) {
        setSelectedProject(found);
        if (modalProjects.length === 0) {
          setModalProjects(data.projects);
        }
      }
    } else {
      setSelectedProject(null);
    }
  }, [location.pathname, data]);

  const handleTabChange = (nextTab: TabType) => {
    if (nextTab === activeTab && !location.pathname.startsWith('/project/')) return;
    const targetPath = getPathFromTab(nextTab);
    navigate(targetPath);
  };

  const handleAnimationEnd = (e: React.AnimationEvent) => {
    if (e.target !== e.currentTarget) return;

    if (flipPhase === 'out' && targetTab) {
      setActiveTab(targetTab);
      setTargetTab(null);
      setFlipPhase('in');
      window.scrollTo({ top: 0, behavior: 'instant' });
    } else if (flipPhase === 'in') {
      setFlipPhase('idle');
    }
  };

  const handleOpenProject = (project: ProjectItem, contextProjects?: ProjectItem[]) => {
    if (contextProjects && contextProjects.length > 0) {
      setModalProjects(contextProjects);
    } else if (data?.projects) {
      setModalProjects(data.projects);
    }
    const projectId = project.id || encodeURIComponent(project.title);
    navigate(`/project/${projectId}`);
  };

  const handleCloseProject = () => {
    navigate('/projects');
  };

  const handleSelectProjectInModal = (project: ProjectItem) => {
    const projectId = project.id || encodeURIComponent(project.title);
    navigate(`/project/${projectId}`);
  };

  if (loading && !data) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: 36,
              height: 36,
              border: '2px solid var(--border-medium)',
              borderTopColor: 'var(--text-primary)',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 16px auto',
            }}
          />
          <p style={{ fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
            Loading Portfolio...
          </p>
        </div>
      </div>
    );
  }

  const { profile, about, contact, projects, settings } = data;

  const renderTabContent = (tab: TabType) => {
    switch (tab) {
      case 'HOME':
        return (
          <HomeSection
            profile={profile}
            about={about}
            projects={projects}
            theme={theme}
            onNavigate={handleTabChange}
            onSelectProject={handleOpenProject}
          />
        );
      case 'PROJECTS':
        return (
          <ProjectsSection
            projects={projects}
            settings={settings.projects}
            onSelectProject={handleOpenProject}
          />
        );
      case 'ABOUT':
        return <AboutSection about={about} />;
      case 'CONTACT':
        return <ContactSection contact={contact} />;
      default:
        return null;
    }
  };

  const flipClass =
    flipPhase === 'out'
      ? `flip-out-${flipDirection}`
      : flipPhase === 'in'
      ? `flip-in-${flipDirection}`
      : '';

  const activeModalProjects = modalProjects.length > 0 ? modalProjects : projects;

  return (
    <div className="app-container">
      {/* Mobile App Style Intro Splash */}
      <IntroSplash designerName={profile.name} />

      {/* Subtle Background Glow */}
      <div className="bg-ambient-glow" />

      {/* Header */}
      <Header
        activeTab={targetTab || activeTab}
        onTabChange={handleTabChange}
        designerName={profile.name}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Main Content */}
      <main className="main-content">
        <div className="page-flip-scene">
          <div
            className={`page-flip-card ${flipClass}`}
            onAnimationEnd={handleAnimationEnd}
          >
            {renderTabContent(activeTab)}
          </div>
        </div>
      </main>

      {/* Project Detail View Modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          projects={activeModalProjects}
          onClose={handleCloseProject}
          onSelectProject={handleSelectProjectInModal}
        />
      )}

      {/* Footer */}
      <Footer designerName={profile.name} />
    </div>
  );
};

export default App;

