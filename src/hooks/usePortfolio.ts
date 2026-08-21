import { useState, useEffect } from 'react';
import { PortfolioData, ProfileInfo, AboutInfo, ContactInfo, ProjectItem } from '../types/portfolio';

const initialEmptyData: PortfolioData = {
  profile: {
    name: '',
    role: '',
    bio: '',
    tickerKeywords: [],
    designPillars: [],
  },
  about: {
    intro: '',
    tools: [],
    skills: [],
    clients: [],
    experience: [],
  },
  contact: {
    headline: '',
    email: '',
    address: '',
    note: '',
  },
  totalProjects: 0,
  projects: [],
};

interface UsePortfolioResult {
  data: PortfolioData;
  loading: boolean;
  error: Error | null;
}

export function usePortfolio(): UsePortfolioResult {
  const [data, setData] = useState<PortfolioData>(initialEmptyData);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        setLoading(true);
        // Base-relative URL for GitHub Pages compatibility
        const basePath = import.meta.env.BASE_URL || './';
        const normalizedBase = basePath.endsWith('/') ? basePath : `${basePath}/`;

        const [profileRes, aboutRes, contactRes, projectsRes] = await Promise.all([
          fetch(`${normalizedBase}data/profile.json`),
          fetch(`${normalizedBase}data/about.json`),
          fetch(`${normalizedBase}data/contact.json`),
          fetch(`${normalizedBase}data/projects.json`),
        ]);

        if (!profileRes.ok || !aboutRes.ok || !contactRes.ok || !projectsRes.ok) {
          throw new Error('Failed to load one or more modular data files');
        }

        const profile: ProfileInfo = await profileRes.json();
        const about: AboutInfo = await aboutRes.json();
        const contact: ContactInfo = await contactRes.json();
        const rawProjects: ProjectItem[] = await projectsRes.json();
        const projects: ProjectItem[] = rawProjects.map((p, index) => ({
          ...p,
          id: p.id || `project-${index + 1}`,
        }));

        if (!isMounted) return;

        setData({
          profile,
          about,
          contact,
          totalProjects: projects.length,
          tickerKeywords: profile.tickerKeywords,
          designPillars: profile.designPillars,
          projects,
        });
      } catch (err) {
        if (!isMounted) return;
        console.error('Failed to load portfolio data:', err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  return { data, loading, error };
}


