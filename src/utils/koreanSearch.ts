/**
 * 한글 초성 검색 및 유연한 텍스트 매칭 유틸리티
 */

// 한글 유니코드 기본 상수
const HANGUL_BASE_CODE = 0xac00; // '가'
const HANGUL_END_CODE = 0xd7a3; // '힣'
const JUNGSUNG_COUNT = 21;
const JONGSUNG_COUNT = 28;
const SLLABIC_COUNT_PER_CHOSUNG = JUNGSUNG_COUNT * JONGSUNG_COUNT; // 588

// 초성 19자 목록
export const CHOSUNG_LIST = [
  'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ',
  'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ',
] as const;

export type Chosung = typeof CHOSUNG_LIST[number];

/**
 * 정규식 특수문자 이스케이프
 */
export function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * 주어진 문자가 초성인지 확인
 */
export function isChosung(char: string): char is Chosung {
  return (CHOSUNG_LIST as readonly string[]).includes(char);
}

/**
 * 검색어(초성, 완성형 한글, 영문, 숫자 등)를 기반으로
 * 초성 검색이 가능한 정규식(RegExp)을 생성합니다.
 *
 * @param query 사용자가 입력한 검색어
 * @returns 대소문자 무시 정규식 객체
 *
 * @example
 * const regex = createChoseongRegex('ㅍㄹㅈㅌ');
 * regex.test('프로젝트'); // true
 *
 * const regex2 = createChoseongRegex('프ㄹ');
 * regex2.test('프로젝트'); // true
 */
export function createChoseongRegex(query: string): RegExp {
  const trimmed = query.trim();
  if (!trimmed) {
    return /(?:)/;
  }

  let pattern = '';

  for (let i = 0; i < trimmed.length; i++) {
    const char = trimmed[i];

    // 공백 처리: 연속 공백을 유연하게 처리
    if (/\s/.test(char)) {
      pattern += '\\s*';
      continue;
    }

    // 1. 단일 자음(초성)인 경우
    const chosungIndex = CHOSUNG_LIST.indexOf(char as Chosung);
    if (chosungIndex !== -1) {
      const startCode = HANGUL_BASE_CODE + chosungIndex * SLLABIC_COUNT_PER_CHOSUNG;
      const endCode = startCode + SLLABIC_COUNT_PER_CHOSUNG - 1;
      const startChar = String.fromCharCode(startCode);
      const endChar = String.fromCharCode(endCode);

      // 초성 자체 또는 해당 초성으로 시작하는 모든 한글 음절 매칭
      pattern += `[${char}${startChar}-${endChar}]`;
      continue;
    }

    const charCode = char.charCodeAt(0);

    // 2. 완성형 한글 음절인 경우 (가 ~ 힣)
    if (charCode >= HANGUL_BASE_CODE && charCode <= HANGUL_END_CODE) {
      const jongsungIndex = (charCode - HANGUL_BASE_CODE) % JONGSUNG_COUNT;

      // 종성(받침)이 없는 경우 -> 사용자가 아직 다음 자모를 입력 중일 수 있으므로
      // 해당 음절에 받침이 붙은 형태까지 포괄하는 범위 매칭 (예: '프' -> [프-픵])
      if (jongsungIndex === 0) {
        const startChar = char;
        const endChar = String.fromCharCode(charCode + JONGSUNG_COUNT - 1);
        pattern += `[${startChar}-${endChar}]`;
      } else {
        // 이미 받침이 있는 경우 해당 음절 정확히 매칭
        pattern += escapeRegExp(char);
      }
      continue;
    }

    // 3. 영문, 숫자, 특수문자 등 기타 문자
    pattern += escapeRegExp(char);
  }

  return new RegExp(pattern, 'i');
}

/**
 * 대상 문자열이 검색어(초성 검색 포함)와 일치하는지 검사합니다.
 *
 * @param target 대상 텍스트
 * @param query 검색어 (초성 또는 완성형)
 * @returns 매칭 여부 (boolean)
 */
export function matchKorean(target?: string | null, query?: string | null): boolean {
  if (!query || !query.trim()) {
    return true;
  }
  if (!target || !target.trim()) {
    return false;
  }

  const regex = createChoseongRegex(query);
  return regex.test(target);
}

/**
 * 여러 개의 대상 문자열 필드 중 하나라도 검색어와 매칭되는지 검사합니다.
 *
 * @param targets 검사할 문자열 목록
 * @param query 검색어
 * @returns 매칭 여부 (boolean)
 */
export function matchKoreanAny(targets: (string | undefined | null)[], query?: string | null): boolean {
  if (!query || !query.trim()) {
    return true;
  }

  const regex = createChoseongRegex(query);
  return targets.some((target) => (target ? regex.test(target) : false));
}
