export interface ProjectItem {
  id?: string;                   // 렌더링 키 및 모달 식별용 ID (자동 생성)
  title: string;                 // 프로젝트 타이틀
  caption: string;               // 요약 캡션 / 설명문
  category: string;              // 카테고리
  image: string;                 // 목록 썸네일 이미지 URL/경로
  detailImages?: string[];       // 상세 뷰 이미지 URL/경로 목록
  date: string;                  // 제작일
  alt: string;                   // 이미지 대체 텍스트
  link?: string;                 // 웹사이트 바로가기 링크 (새 창 연결)
  main?: boolean;                // 홈화면 메인 스포트라이트 대표작 지정 여부
}

export interface DesignPillar {
  num: string;
  title: string;
  subtitle?: string;
  desc: string;
  icon?: string;
}

export interface ProfileInfo {
  name: string;
  role: string;
  bio: string;
  tickerKeywords?: string[];
  designPillars?: DesignPillar[];
}

export interface ExperienceItem {
  month: string;
  client: string;
  description: string;
}

export interface ExperienceYear {
  year: string;
  items: ExperienceItem[];
}

export interface AboutInfo {
  image?: string;
  intro: string;
  tools: string[];
  skills: string[];
  clients: string[];
  experience: ExperienceYear[];
}

export interface ContactInfo {
  headline: string;
  email: string;
  address: string;
  note: string;
}

export interface ProjectSettings {
  initialVisibleCount: number;
  loadMoreStep: number;
}

export interface HomeSettings {
  recentProjectsCount?: number;
}

export interface SiteSettings {
  projects: ProjectSettings;
  home?: HomeSettings;
}

export interface PortfolioData {
  profile: ProfileInfo;
  about: AboutInfo;
  contact: ContactInfo;
  settings: SiteSettings;
  totalProjects: number;
  tickerKeywords?: string[];
  designPillars?: DesignPillar[];
  projects: ProjectItem[];
}

