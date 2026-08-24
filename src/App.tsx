import React, { useState } from 'react';
import { usePortfolio } from './hooks/usePortfolio';
import { useTheme } from './hooks/useTheme';
import { Header, TabType } from './components/Header';
import { HomeSection } from './components/HomeSection';
import { ProjectsSection } from './components/ProjectsSection';
import { ProjectModal } from './components/ProjectModal';
import { AboutSection } from './components/AboutSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { ProjectItem } from './types/portfolio';

export const App: React.FC = () => {
  const { data, loading } = usePortfolio();
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<TabType>('HOME');
  const [targetTab, setTargetTab] = useState<TabType | null>(null);
  const [flipDirection, setFlipDirection] = useState<'right' | 'left'>('right');
  const [flipPhase, setFlipPhase] = useState<'idle' | 'out' | 'in'>('idle');
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [modalProjects, setModalProjects] = useState<ProjectItem[]>([]);

  const TAB_ORDER: TabType[] = ['HOME', 'PROJECTS', 'ABOUT', 'CONTACT'];

  const handleTabChange = (nextTab: TabType) => {
    if (nextTab === activeTab || flipPhase !== 'idle') return;
    const currentIndex = TAB_ORDER.indexOf(activeTab);
    const targetIndex = TAB_ORDER.indexOf(nextTab);
    setFlipDirection(targetIndex >= currentIndex ? 'right' : 'left');
    setTargetTab(nextTab);
    setFlipPhase('out');
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
    setSelectedProject(project);
    setModalProjects(contextProjects && contextProjects.length > 0 ? contextProjects : (data?.projects || []));
  };

  const handleCloseProject = () => {
    setSelectedProject(null);
    setModalProjects([]);
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

  const { profile, about, contact, projects } = data;

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
          onSelectProject={(p) => setSelectedProject(p)}
        />
      )}

      {/* Footer */}
      <Footer designerName={profile.name} />
    </div>
  );
};

export default App;
