# 🎨 디자이너 포트폴리오 웹사이트 사용 설명서 (비개발자용)

이 프로젝트는 나만의 작품과 이력을 한눈에 보여줄 수 있는 **디자이너 포트폴리오 웹사이트**입니다.  
복잡한 소스코드를 몰라도 **메모장이나 텍스트 편집기**로 데이터 파일만 수정하면 웹사이트의 내용(프로젝트, 소개, 경력, 연락처 등)을 손쉽게 바꿀 수 있습니다.

---

## 💻 1. 내 컴퓨터에서 사이트 켜는 방법

### 1단계: 필수 프로그램 준비
- 컴퓨터에 [Node.js](https://nodejs.org/)가 설치되어 있어야 합니다. (LTS 버전 권장)

### 2단계: 터미널(명령 프롬프트) 열고 실행하기
프로젝트 폴더에서 터미널을 열고 아래 명령어를 순서대로 입력합니다.

1. **최초 1회 실행 (프로그램 설치)**
   ```bash
   npm install
   ```
2. **사이트 실행 (개발 모드)**
   ```bash
   npm run dev
   ```
3. 터미널 창에 나타나는 링크(`http://localhost:5173`)를 복사해서 크롬, 사파리 등 웹 브라우저 주소창에 넣고 접속하면 내 사이트가 바로 열립니다.
4. 종료할 때는 터미널 창에서 `Ctrl + C`를 누르면 됩니다.

---

## 📝 2. 내용 수정하기 (콘텐츠 관리)

모든 텍스트와 프로젝트 데이터는 **`public/data/`** 폴더 안에 있는 5개의 파일에 모여 있습니다.  
이 파일들만 수정하고 저장하면 웹사이트에 즉시 반영됩니다.

```
📁 public/
└── 📁 data/
    ├── settings.json   👈 프로젝트 노출 개수 및 화면 표시 옵션 설정
    ├── projects.json   👈 프로젝트 작품 목록 및 상세 이미지
    ├── profile.json    👈 상단 메인 소개, 이름, 역할, 키워드
    ├── about.json      👈 상세 소개, 스킬/툴, 클라이언트, 경력 이력
    └── contact.json    👈 이메일, 주소 등 연락처 정보
```

---

### ① 프로젝트(작품) 추가 및 수정: `projects.json`
- 파일 위치: `public/data/projects.json`
- 프로젝트를 추가하거나 수정할 때는 아래 형식에 맞춰 작성합니다.

```json
[
  {
    "main": true, //메인 index의 대표 작품 설정시 선택
    "title": "작품 제목 (예: 2024 브랜드 리뉴얼)",
    "caption": "작품에 대한 간단한 한 줄 설명",
    "category": "분야 (예: UI/UX, Graphic, Branding)",
    "image": "images/project/2018/thumb/xxxxx",
    "date": "Jan, 2018",
    "alt": "",
    "detailImages": [
      "images/project/2018/contents/xxxxxx",
      "images/project/2018/contents/xxxxxx"
    ],
    "videos": [
      "https://www.youtube.com/watch?v=유튜브영상ID",
      "https://www.youtube.com/shorts/쇼츠영상ID"
    ],
    "link": "외부로 링크"
  }
]
```

* **`title`**: 갤러리 카드와 상세 화면에 표시될 작품 이름
* **`caption`**: 마우스를 올렸을 때 나타나는 요약 설명
* **`category`**: 필터링 및 태그로 사용되는 카테고리명
* **`date`**: 작업 연도
* **`image`**: 갤러리 목록에 노출될 대표 썸네일 이미지 경로
* **`detailImages`**: 작품을 클릭했을 때 모달 창에 세로로 펼쳐지는 상세 이미지 경로 목록
* **`videos`**: 모달 상세에 표시될 유튜브 영상 링크 (일반 가로 영상 및 세로 숏츠 영상 지원, 단일 문자열 또는 복수 배열 등록 가능)
  - 일반 영상 예시: `"https://www.youtube.com/watch?v=..."` 또는 `"https://youtu.be/..."` (16:9 와이드 플레이어로 표시)
  - 숏츠 영상 예시: `"https://www.youtube.com/shorts/..."` (9:16 스마트폰 세로 비율 플레이어로 표시)
  - 영상 링크를 여러 개 등록할 경우 상세 이미지처럼 순서대로 모두 표시되며, 숏츠 영상이 여러 개인 경우 세련된 반응형 그리드로 정렬됩니다.
* **`link`**: 웹사이트 바로가기 외부 링크 (선택 사항)


[ Category 예시 ]
- EVENT: 이벤트 웹사이트, 참여형 프로모션 페이지, SNS 이벤트 페이지
- BRANDING: 브랜드 비주얼 일러스트, CI/BI, 키비주얼, 경쟁 PT 시안, 제안서용 디자인 목업
- SOCIAL: 인스타그램·페이스북 카드뉴스, SNS 배너, 콘텐츠 시리즈
- WEB: 기업 사이트, 브랜드 사이트, 쇼핑몰 리뉴얼
- ILLUSTRATION : 일러스트 제작
- PRINT: 카탈로그, 브로슈어, 리플렛
- VIDEO: 광고 영상, 브랜드 필름, 프로모션 영상
- ETC: 분류가 애매한 소규모 작업, 실험적 프로젝트, 사진 촬영
- E-COMMERCE : 온라인 쇼핑몰


---

### ② 홈 상단 소개 문구 수정: `profile.json`
- 파일 위치: `public/data/profile.json`
- 사이트 첫 화면에 크게 들어가는 이름, 직함, 슬로건 등을 수정합니다.

```json
{
  "name": "디자이너 이름",
  "role": "직무/직함 (예: Senior UI/UX & Graphic Designer)",
  "bio": "메인 소개 문구",
  "tickerKeywords": [
    "상단 롤링 키워드 1",
    "상단 롤링 키워드 2",
    "상단 롤링 키워드 3"
  ]
}
```

---

### ③ 경력·스킬·클라이언트 수정: `about.json`
- 파일 위치: `public/data/about.json`
- 디자이너 상세 소개, 보유 스킬 및 다루는 소프트웨어 툴, 협업 고객사, 연도별 경력 타임라인을 관리합니다.

* **`intro`**: 디자이너 소개 전문
* **`tools`**: 포토샵, 일러스트, 피그마 등 다루는 툴 목록
* **`skills`**: 디자인 전문 역량 태그
* **`clients`**: 함께 일한 주요 고객사 / 브랜드 목록
* **`experience`**: 연도별 작업 및 경력 이력 목록
  ```json
  {
    "year": "2024",
    "role": "담당 역할 또는 직급",
    "company": "회사명 또는 프로젝트명",
    "description": "수행한 업무 상세 내용"
  }
  ```

---

### ④ 연락처 정보 수정: `contact.json`
- 파일 위치: `public/data/contact.json`
- 화면 최하단 Contact 섹션의 이메일 및 안내 문구를 수정합니다.

```json
{
  "headline": "함께 멋진 작업을 만들어보세요",
  "email": "내_이메일_주소@example.com",
  "address": "Seoul, South Korea",
  "note": "프로젝트 문의 및 협업 제안은 언제든지 환영합니다."
}
```

---

### ⑤ 화면 표시 개수 및 페이징 설정: `settings.json`
- 파일 위치: `public/data/settings.json`
- 프로젝트 갤러리와 홈 화면에 한 번에 표시할 카드 개수 및 '더보기' 단위를 설정합니다.

```json
{
  "projects": {
    "initialVisibleCount": 12,
    "loadMoreStep": 24
  },
  "home": {
    "recentProjectsCount": 6
  }
}
```

* **`projects.initialVisibleCount`**: PROJECTS(프로젝트) 탭에서 처음에 기본으로 보여줄 프로젝트 카드 개수 (예: `12`, `24`)
* **`projects.loadMoreStep`**: 프로젝트 탭 하단에서 **[+ 더보기(Load More)]** 버튼을 클릭할 때 한 번에 추가로 로드할 개수 (예: `24`)
* **`home.recentProjectsCount`**: 홈 화면 메인 대표작(Featured) 하단 그리드에 보여줄 서브 프로젝트 개수 (예: `6`)

---

## 🖼️ 3. 이미지 파일 넣는 방법

1. **내 컴퓨터에 있는 이미지 사용 시**:
   - `public/images/` 폴더 아래에 새 폴더를 만들거나 이미지를 복사해 넣습니다.
   - 예: `public/images/projects/my-work.jpg`에 넣었다면, JSON 파일에는 `"images/projects/my-work.jpg"`라고 작성합니다. (앞에 `public/`은 제외)
2. **인터넷 링크(URL) 사용 시**:
   - 이미 웹에 올라가 있는 이미지 링크가 있다면 그대로 넣으셔도 됩니다.
   - 예: `"https://example.com/image.jpg"`

---

## ⚠️ 4. JSON 파일 수정 시 꼭 주의할 점!

데이터 파일(`.json`)을 수정할 때는 아래 문법 규칙을 꼭 지켜주셔야 오류가 나지 않습니다.

1. **큰따옴표(`"`)만 사용**: 작은따옴표(`'`)는 오류가 발생합니다. 반드시 큰따옴표를 사용하세요.
2. **마지막 항목 뒤에는 쉼표(`,`) 금지**:
   - ⭕ 올바른 예: `["사과", "바나나"]`
   - ❌ 잘못된 예: `["사과", "바나나",]` (마지막 쉼표 때문에 에러 발생)
3. **괄호 짝 맞추기**: `{ }` 중괄호와 `[ ]` 대괄호는 항상 열고 닫는 짝이 맞아야 합니다.

---

## 🌐 5. 사이트 배포 (인터넷에 올리기)

웹 호스팅(GitHub Pages, Vercel, Netlify 등)에 업로드할 완성본 파일을 만들 때는 다음 명령어를 실행합니다.

```bash
npm run build
```

빌드가 완료되면 **`dist`** 폴더가 생성되며, 이 폴더의 내용물이 실제 인터넷에 올라가는 완성된 웹사이트 파일입니다.
