# Frontend Development Rules & Guidelines

Next.js 및 React 코드를 작성할 때 따르는 프론트엔드 규칙이다.

## 1. 아키텍처 및 파일 구조 (Routing & Components)

### Page 구성 규칙

- 모든 `page.tsx` 파일은 반드시 Server Component여야 한다.
- 파일 최상단에 `'use client'`를 절대 추가하지 않는다.
- 특정 페이지에서만 사용되는 컴포넌트는 해당 페이지 폴더 하위에 `_components` 폴더를 생성하여 관리한다.
- 예시: `app/blog/page.tsx`가 있다면, 관련 컴포넌트는 `app/blog/_components/`에 위치한다.
- 여러 페이지에서 공유되는 공통 컴포넌트는 루트 디렉토리의 `components/common/` 폴더에 위치시킨다.

### Utility & Library 규칙

- `libs/` 또는 `utils/` 폴더 내의 파일명은 항상 카멜 케이스(camelCase)로 작성한다.

## 2. 컴포넌트 작성 규칙 (Component Convention)

### 네이밍 및 선언

- 컴포넌트 파일명은 항상 파스칼 케이스(PascalCase)로 작성한다.
- 메인 컴포넌트 선언은 항상 `export default function` 형식을 사용한다.
- 컴포넌트 내부에서 분리하여 사용하는 하위 컴포넌트 역시 `function` 키워드를 사용하여 정의한다.

### 타입 지정 (TypeScript)

- `interface` 대신 반드시 `type`을 사용하여 타입을 정의한다.

### 함수 정의 및 핸들러 규칙

- 컴포넌트 내부 및 `libs/`, `utils/` 파일 내에서 작성하는 함수는 항상 화살표 함수(Arrow Function) 형식을 사용한다.
- 제출, 삭제 등 사용자 액션을 처리하는 이벤트 핸들러 함수는 반드시 `handle~` 접두사를 붙여 명명한다.
- 예시: `handleSubmit`, `handleDelete` 등

## 3. 스타일링 및 애니메이션 (Styling & Animation)

- 스타일링은 기본적으로 Tailwind CSS와 shadcn/ui를 사용한다.
- 애니메이션 처리를 위해 framer-motion(motion) 등을 사용할 수 있으나, 사용하기 전에 반드시 유저에게 먼저 동의를 구하거나 질문해야 한다. (임의로 먼저 구현 금지)
