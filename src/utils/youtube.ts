import { ProjectItem } from '../types/portfolio';

export interface YouTubeMediaItem {
  id: string;          // YouTube Video ID
  originalUrl: string; // 원본 링크
  embedUrl: string;    // iframe 임베드 URL
  isShorts: boolean;   // 쇼츠 여부 (세로형 9:16 비율 적용 여부)
  title?: string;
}

/**
 * 유튜브 URL에서 Video ID 및 쇼츠 여부를 파싱합니다.
 * 
 * 지원 형식:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/shorts/VIDEO_ID
 * - https://youtube.com/shorts/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - https://www.youtube.com/live/VIDEO_ID
 * - https://m.youtube.com/watch?v=VIDEO_ID
 * - https://m.youtube.com/shorts/VIDEO_ID
 */
export function parseYouTubeUrl(url: string | undefined | null): YouTubeMediaItem | null {
  if (!url || typeof url !== 'string') return null;

  const trimmed = url.trim();
  if (!trimmed) return null;

  // 1. YouTube Shorts 패턴 검사: /shorts/VIDEO_ID
  const shortsMatch = trimmed.match(/(?:youtube\.com|youtu\.be)\/shorts\/([a-zA-Z0-9_-]{11})/i);
  if (shortsMatch && shortsMatch[1]) {
    const id = shortsMatch[1];
    return {
      id,
      originalUrl: trimmed,
      embedUrl: `https://www.youtube-nocookie.com/embed/${id}?rel=0&playsinline=1`,
      isShorts: true,
    };
  }

  // 2. 일반 YouTube Video 패턴 (watch?v=, youtu.be/, embed/, live/ 등)
  const standardMatch = trimmed.match(
    /(?:https?:\/\/)?(?:www\.|m\.)?(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|v\/|live\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i
  );

  if (standardMatch && standardMatch[1]) {
    const id = standardMatch[1];
    return {
      id,
      originalUrl: trimmed,
      embedUrl: `https://www.youtube-nocookie.com/embed/${id}?rel=0&playsinline=1`,
      isShorts: false,
    };
  }

  // 3. 만약 11자리 ID만 직접 입력된 경우 (예: "dQw4w9WgXcQ")
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return {
      id: trimmed,
      originalUrl: `https://www.youtube.com/watch?v=${trimmed}`,
      embedUrl: `https://www.youtube-nocookie.com/embed/${trimmed}?rel=0&playsinline=1`,
      isShorts: false,
    };
  }

  return null;
}

/**
 * ProjectItem에서 영상 링크(단일 문자열 또는 배열)를 추출하여 파싱된 YouTubeMediaItem 목록을 반환합니다.
 */
export function extractProjectVideos(project: ProjectItem | undefined | null): YouTubeMediaItem[] {
  if (!project) return [];

  const rawEntries: string[] = [];

  // project.videos 확인 (배열 또는 단일 문자열)
  if (Array.isArray(project.videos)) {
    rawEntries.push(...project.videos);
  } else if (typeof project.videos === 'string') {
    rawEntries.push(project.videos);
  }

  // project.youtubeUrls 확인 (배열 또는 단일 문자열)
  if (Array.isArray(project.youtubeUrls)) {
    rawEntries.push(...project.youtubeUrls);
  } else if (typeof project.youtubeUrls === 'string') {
    rawEntries.push(project.youtubeUrls);
  }

  const results: YouTubeMediaItem[] = [];
  const seenIds = new Set<string>();

  for (const entry of rawEntries) {
    if (!entry || typeof entry !== 'string') continue;
    
    // 쉼표나 줄바꿈으로 여러 링크를 분리한 경우도 안전하게 지원
    const subUrls = entry.split(/[\r\n,]+/).map((s) => s.trim()).filter(Boolean);

    for (const subUrl of subUrls) {
      const parsed = parseYouTubeUrl(subUrl);
      if (parsed && !seenIds.has(parsed.id)) {
        seenIds.add(parsed.id);
        results.push(parsed);
      }
    }
  }

  return results;
}
