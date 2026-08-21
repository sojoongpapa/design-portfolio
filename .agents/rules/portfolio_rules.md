# Designer Portfolio Project Rules & Guidelines

## 1. 프로젝트 개요 및 기술 스택
- **목적**: 디자이너 포트폴리오 웹사이트 (GitHub Pages 호스팅)
- **프레임워크**: React 19 (Vite 기반), TypeScript (타입 안전성 및 방어적 프로그래밍)
- **스타일링**: CSS Variables 기반 커스텀 모던 CSS (라이트/다크 테마 완전 지원, 가변 그리드)
- **배포 타겟**: GitHub Pages (상대 경로 `base: './'` 설정 및 GitHub Actions 자동 배포 워크플로우 적용)
- **데이터 관리**: 단일 원본 정적 JSON 기반 (`public/data/portfolio.json`)

---

## 2. 코딩 & 아키텍처 원칙 (SOLID & Clean Code)
1. **단일 책임 원칙 (SRP)**:
   - UI 렌더링 컴포넌트와 데이터 로드/상태 로직 분리 (`usePortfolio`, `useTheme` 커스텀 훅 활용).
   - 각 섹션(헤더, 프로젝트 그리드, 상세 뷰어, About, Contact, 푸터)을 독립 모듈 컴포넌트로 관리.
2. **방어적 프로그래밍 (Defensive Programming)**:
   - 모든 이미지 필드(`customImage`, `image`, `customDetailImages`, `detailImages`)에 대해 fallback 및 에러 핸들링(`onError` 대체 UI/숨김) 처리.
   - 데이터 로드 실패 시에도 번들된 기본 상태를 유지하여 런타임 크래시 방지.
3. **Early Return 패턴**:
   - 조건부 렌더링 및 에러 처리 시 중첩 분기(if-else)를 지양하고 Early Return 적용.
4. **네이밍 컨벤션**:
   - 컴포넌트: PascalCase (`ProjectCard.tsx`, `ProjectModal.tsx`, `AboutSection.tsx`)
   - 유틸/훅: camelCase (`usePortfolio.ts`, `useTheme.ts`)
   - 인터페이스/타입: PascalCase (`ProjectItem`, `PortfolioData`, `AboutInfo`, `Theme`)

---

## 3. 포트폴리오 데이터 관리 규약 (Single Source of Truth)
- **단일 원본 파일**: `public/data/portfolio.json`
- 모든 프로젝트, 프로필, 어바웃, 연락처 정보는 이 파일 하나에서만 수정하고 관리합니다.

### 데이터 스키마 표준 (순서는 JSON 파일의 배열 순서 기준)
```typescript
export interface ProjectItem {
  id?: string;                   // 고유 ID (선택사항, 미지정 시 JSON 인덱스 기반 자동 생성)
  title: string;                 // 프로젝트 타이틀
  caption: string;               // 요약 캡션 / 설명문
  category: string;              // 카테고리 (All, UI/UX 등)
  image: string;                 // 목록 썸네일 이미지 URL/경로
  detailImages?: string[];       // 상세 뷰 고해상도 이미지 URL/경로 목록
  date: string;                  // 제작일 (예: "Jul 8, 2026")
  alt: string;                   // 이미지 대체 텍스트
  link?: string;                 // 프로젝트 관련 링크 (웹사이트, 라이브 데모 등)
}

export interface AboutInfo {
  image?: string;                // 어바웃 프로필 이미지 경로 (예: "images/about/filename.jpg")
  intro: string;                 // 디자이너 소개 전문
  tools: string[];               // 사용 툴 목록 (8종)
  skills: string[];              // 보유 스킬 목록 (11종)
  clients: string[];             // 파트너십 클라이언트 목록 (39종)
  experience: {
    year: string;
    items: {
      month: string;
      client: string;
      description: string;
    }[];
  }[];
}

export interface ContactInfo {
  headline: string;
  email: string;
  address: string;
  note: string;
}

export interface PortfolioData {
  profile: {
    name: string;
    role: string;
    bio: string;
    email: string;
    address: string;
    tagline: string;
  };
  about: AboutInfo;
  contact: ContactInfo;
  totalProjects: number;
  projects: ProjectItem[];
}
```

---

## 4. 테마 및 UI/UX 규칙
- **테마 시스템**:
  - 기본 시작 테마: **접속 시 라이트/다크 모드 50% 확률 랜덤 시작**
  - 헤더 우측 토글 버튼을 통해 수동 전환 지원
- **상세 뷰어 (PROJECT/view/...)**:
  - 프로젝트 클릭 시 상단 컨트롤 바(이전/다음, 카운터, 닫기)와 함께 전체 고해상도 상세 이미지들이 세로로 스크롤되며 렌더링
  - `ESC` 키 및 `ArrowLeft` / `ArrowRight` 키보드 내비게이션 기본 지원
- **모바일 반응형 & 접근성**:
  - 한글 텍스트 줄바꿈 방어: `word-break: keep-all;`, `overflow-wrap: break-word;`
  - 이미지 우선순위: `image` (목록 썸네일) 및 `detailImages` (상세 뷰어) 경로를 통한 직접 지정
- **PWA (Progressive Web App)**:
  - 데스크톱(Chrome/Edge) 및 모바일(iOS 사파리 홈 화면 추가, Android Chrome) 앱 설치 지원
  - `manifest.webmanifest`, 최소 pass-through `sw.js`, 192x192 / 512x512 PNG 아이콘 에셋 적용

---

## 5. 검증 및 배포 규약
- **검증 방식**: `npm run build`를 실행하여 빌드 오류가 없는지 확인합니다.
- **Vite & 배포 설정**:
  - `vite.config.ts`의 `base` 경로는 `./`로 설정하여 서브 경로 배포 시 에셋 404 방지
  - `.github/workflows/deploy.yml`을 통해 main/master 브랜치 푸시 시 자동 빌드 및 배포


