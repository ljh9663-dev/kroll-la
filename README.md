# K-Roll LA — Site Guide

**English** | [한국어](#한국어)

---

## What This Site Is

A static marketing website for K-Roll LA, hosted on Cloudflare Pages. Every push to `main` on GitHub automatically redeploys the live site. No build step, no server to manage.

---

## How to Edit Things

### Edit the AI chat personality / menu info
**File:** `functions/system-prompt.js`

1. Go to [github.com/ljh9663-dev/kroll-la](https://github.com/ljh9663-dev/kroll-la)
2. Click `functions/` → `system-prompt.js`
3. Click the **pencil icon** (top right)
4. Edit the text inside the backtick block — change menu items, prices, hours, tone, anything
5. Click **"Commit changes"** → site updates in ~1 minute

### Edit the website content (text, colors, layout)
**File:** `index.html`

Same steps as above but open `index.html`. The entire site is one file. Search for the text you want to change (Ctrl+F / Cmd+F in the GitHub editor), edit it, commit.

### Add or replace images
1. In the repo, navigate to `assets/images/`
2. Click **"Add file" → "Upload files"**
3. Upload your image (prefer `.webp` format)
4. In `index.html`, update the `src` attribute to match: `assets/images/your-file.webp`

---

## Using Claude Code (Recommended for Bigger Changes)

Open a terminal in the project folder and type what you want:

```
claude "change the hero headline to X"
claude "add a new menu item called Y at $Z"
claude "update the AI chatbot to also know about our catering menu"
```

Claude will make the changes and push them. The site deploys automatically.

---

## Common Commands

```bash
# See what changed
git status

# Push your changes live
git add . && git commit -m "your note here" && git push

# Run the site locally (to preview before pushing)
npm run dev
# then open http://localhost:3000
```

---

## File Map

```
index.html              ← entire website (HTML + styles + JS)
functions/
  chat.js               ← AI chat logic (don't touch unless debugging)
  system-prompt.js      ← AI personality & menu info (edit freely)
assets/
  images/               ← photos
  icons/                ← SVG icons
  fonts/                ← font files
  video/                ← video files
```

---

---

# 한국어

## 이 사이트란?

K-Roll LA 마케팅 웹사이트입니다. GitHub `main` 브랜치에 변경사항을 올리면 Cloudflare Pages가 자동으로 라이브 사이트를 업데이트합니다. 별도의 빌드나 서버 관리 불필요.

---

## 편집 방법

### AI 챗봇 성격 / 메뉴 정보 수정
**파일:** `functions/system-prompt.js`

1. [github.com/ljh9663-dev/kroll-la](https://github.com/ljh9663-dev/kroll-la) 접속
2. `functions/` → `system-prompt.js` 클릭
3. 오른쪽 상단 **연필 아이콘** 클릭
4. 백틱(`) 안의 텍스트 편집 — 메뉴 항목, 가격, 영업시간, 말투 등 자유롭게 수정
5. **"Commit changes"** 클릭 → 약 1분 후 사이트 반영

### 웹사이트 내용 수정 (텍스트, 색상, 레이아웃)
**파일:** `index.html`

위와 동일한 방법으로 `index.html` 열기. 사이트 전체가 하나의 파일입니다. GitHub 에디터에서 Ctrl+F / Cmd+F로 원하는 텍스트 검색 후 수정, 커밋.

### 이미지 추가 / 교체
1. 저장소에서 `assets/images/` 이동
2. **"Add file" → "Upload files"** 클릭
3. 이미지 업로드 (`.webp` 형식 권장)
4. `index.html`에서 해당 `src` 경로를 새 파일명으로 변경: `assets/images/파일명.webp`

---

## Claude Code 사용 (큰 변경사항에 권장)

프로젝트 폴더에서 터미널을 열고 원하는 내용을 입력하세요:

```
claude "히어로 헤드라인을 X로 바꿔줘"
claude "Y라는 새 메뉴를 $Z 가격으로 추가해줘"
claude "AI 챗봇이 케이터링 메뉴도 알 수 있게 해줘"
```

Claude가 변경 후 자동으로 푸시합니다. 사이트는 자동 배포됩니다.

---

## 자주 쓰는 명령어

```bash
# 변경된 파일 확인
git status

# 변경사항 라이브에 반영
git add . && git commit -m "변경 내용 메모" && git push

# 로컬에서 미리보기 (푸시 전 확인용)
npm run dev
# http://localhost:3000 에서 확인
```

---

## 파일 구조

```
index.html              ← 웹사이트 전체 (HTML + 스타일 + JS)
functions/
  chat.js               ← AI 챗봇 로직 (디버깅 외엔 건드리지 말 것)
  system-prompt.js      ← AI 성격 & 메뉴 정보 (자유롭게 편집)
assets/
  images/               ← 사진
  icons/                ← SVG 아이콘
  fonts/                ← 폰트 파일
  video/                ← 동영상 파일
```
