---
name: Image Experiment Board
overview: 메인페이지를 실험 목록용 칸반보드로 바꾸고, 첫 번째 상세 페이지로 Next.js Image 컴포넌트의 props, 경고 메시지, 권장 사용 패턴을 정리하는 구조를 만든다.
todos:
  - id: kanban-home
    content: 메인 페이지를 실험 목록 칸반보드로 설계하고 Next Image 상세 링크를 배치한다.
    status: completed
  - id: next-image-page
    content: Next.js Image 전용 상세 라우트를 만들고 props, 경고, 해결책을 섹션별로 정리한다.
    status: completed
  - id: experiment-data-shape
    content: 이후 실험 카드를 쉽게 추가할 수 있도록 카드 데이터를 배열 기반 구조로 둔다.
    status: completed
  - id: verify-build
    content: 구현 후 build와 lint/diagnostics로 라우트 및 타입 문제를 확인한다.
    status: completed
isProject: false
---

# Next Image 실험 칸반 설계

## 목표

- [`src/app/page.tsx`](src/app/page.tsx)는 실험 목록을 보여주는 칸반보드 형태의 랜딩 페이지로 전환합니다.
- 첫 번째 카드 `Next.js Image`를 클릭하면 [`src/app/experiments/next-image/page.tsx`](src/app/experiments/next-image/page.tsx)로 이동하도록 설계합니다.
- 상세 페이지는 실제 실험을 계속 추가할 수 있도록 `props 정리`, `권장 패턴`, `자주 뜨는 경고`, `재현 체크리스트` 중심으로 구성합니다.

## 현재 코드에서 반영할 점

현재 메인 페이지는 기본 템플릿이며 `Image`에 `priority`를 사용하고 있습니다. 프로젝트의 Next.js 버전은 `16.2.10`이라 문서 기준으로 `priority`는 deprecated이고, LCP 이미지에는 상황에 따라 `loading="eager"`, `fetchPriority="high"`, 또는 `preload`를 비교해서 설명하는 구성이 좋습니다.

```tsx
<Image
  className="dark:invert"
  src="/next.svg"
  alt="Next.js logo"
  width={100}
  height={20}
  priority
/>
```

## 페이지 구조

- [`src/app/page.tsx`](src/app/page.tsx)

  - Server Component 유지
  - 칸반 컬럼 예시: `Planned`, `In Progress`, `Notes`
  - 첫 번째 카드: `Next.js Image 컴포넌트`
  - 카드에는 실험 목적, 다룰 경고, 상태, 상세 링크를 표시
  - 이후 실험을 배열 데이터에 추가하기 쉬운 형태로 작성

- [`src/app/experiments/next-image/page.tsx`](src/app/experiments/next-image/page.tsx)
  - Server Component로 신규 라우트 생성
  - 섹션 구성:
    - `Image props 핵심`: `src`, `alt`, `width`, `height`, `fill`, `sizes`, `loading`, `preload`, `fetchPriority`, `quality`, `placeholder`, `unoptimized`
    - `LCP/above the fold 판단`: hero 이미지일 때 어떤 속성을 선택할지
    - `sizes 경고 정리`: `fill` 또는 responsive CSS에서 `sizes`가 필요한 이유
    - `에러/경고 메시지 모음`: 실제 개발 중 확인할 메시지와 해결책
    - `실험 체크리스트`: 나중에 케이스별로 검증할 항목

## 경고 메시지 정리 방향

- `Image with src "..." was detected as the Largest Contentful Paint (LCP). Please add the loading="eager" property if this image is above the fold.`

  - above the fold 이미지라면 `loading="eager"` 또는 `fetchPriority="high"` 검토
  - 단일 hero/LCP 이미지라면 `preload`도 비교 대상으로 문서화

- `Image with src "..." has fill but is missing sizes prop.`

  - `fill` 사용 시 실제 렌더링 폭에 맞는 `sizes` 작성
  - 예: `sizes="(max-width: 768px) 100vw, 50vw"`

- `Image is missing required width/height` 계열

  - 정적 import, `fill` 사용이 아니라면 `width`와 `height`를 둘 다 제공
  - CSS로 렌더 크기를 바꿔도 intrinsic ratio 보존용 값은 필요

- remote image 관련 오류
  - 외부 이미지는 `next.config`의 `images.remotePatterns`가 필요할 수 있음
  - 첫 구현에서는 설정 변경 없이 로컬 이미지/기존 public asset 기준으로 설명하고, remote 실험은 별도 카드로 남김

## 디자인 방향

- 실험실 느낌의 `technical kanban` 스타일로 구성합니다.
- Tailwind CSS만 사용하고, 현재 규칙에 따라 framer-motion 등 애니메이션 라이브러리는 사용하지 않습니다.
- 메인페이지는 실험 목록 탐색성이 중요하므로 카드 밀도는 적당히 높이고, 상세 페이지는 문서처럼 읽히되 경고 메시지는 코드 블록/콜아웃 형태로 빠르게 찾게 만듭니다.

## 검증 계획

- `npm run build`로 Next 라우트와 타입 오류를 확인합니다.
- 가능하면 `npm run dev` 후 브라우저 콘솔에서 Image 관련 경고가 없는지 확인합니다.
- 이번 구현은 실제로 경고를 의도적으로 발생시키지 않고, 상세 페이지에 재현 조건과 예상 메시지를 정리합니다. 나중에 실험별 카드에서 의도적 재현 페이지를 추가할 수 있게 확장합니다.
