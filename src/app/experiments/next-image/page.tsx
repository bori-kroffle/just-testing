import Image from 'next/image'
import Link from 'next/link'

type PropNote = {
  name: string
  summary: string
  useWhen: string
}

type WarningNote = {
  message: string
  cause: string
  fix: string
}

type GoodExample = {
  title: string
  bestFor: string
  code: string
}

type ResolutionExample = {
  title: string
  summary: string
  code: string
}

const experimentImageSrc = '/images/next-image/next_image_01.png'
const experimentImageAlt = '실험실에서 플라스크를 들고 있는 연구원 캐릭터'
const experimentImageWidth = 1408
const experimentImageHeight = 768

const propNotes: PropNote[] = [
  {
    name: 'src',
    summary:
      '이미지 경로입니다. public 경로, static import, 허용된 원격 URL을 사용할 수 있습니다.',
    useWhen:
      '원격 URL은 next.config의 images.remotePatterns 실험에서 별도로 다룹니다.',
  },
  {
    name: 'alt',
    summary:
      '스크린 리더와 이미지 실패 시 대체 텍스트로 쓰이는 필수 접근성 속성입니다.',
    useWhen:
      '장식 이미지는 빈 문자열, 의미 있는 이미지는 페이지 문맥을 대체할 수 있는 문장을 씁니다.',
  },
  {
    name: 'width / height',
    summary:
      '브라우저가 비율을 미리 계산해 레이아웃 시프트를 줄이도록 돕는 intrinsic size입니다.',
    useWhen:
      'static import 또는 fill이 아니라면 둘 다 제공하는 것을 기본값으로 둡니다.',
  },
  {
    name: 'fill',
    summary:
      '부모 박스를 기준으로 이미지를 채웁니다. 부모는 position: relative가 필요합니다.',
    useWhen:
      '정확한 원본 크기를 모르거나 카드/히어로처럼 반응형 박스에 맞출 때 사용합니다.',
  },
  {
    name: 'sizes',
    summary:
      '브라우저가 srcset 후보 중 어떤 크기를 받을지 결정하는 힌트입니다.',
    useWhen:
      'fill 또는 CSS로 반응형 렌더 크기를 만들 때 거의 항상 함께 씁니다.',
  },
  {
    name: 'loading',
    summary: '이미지를 언제 요청할지 제어합니다. 기본값은 lazy입니다.',
    useWhen:
      'above the fold 또는 LCP 후보 이미지는 loading="eager"를 검토합니다.',
  },
  {
    name: 'preload',
    summary:
      'head에 preload hint를 넣어 중요한 이미지를 더 빨리 발견하게 합니다.',
    useWhen: '단일 hero 이미지처럼 LCP가 명확할 때만 제한적으로 비교합니다.',
  },
  {
    name: 'fetchPriority',
    summary: '브라우저의 fetch 우선순위 힌트입니다.',
    useWhen:
      'LCP 이미지를 빨리 가져오되 preload까지는 필요하지 않은 케이스와 비교합니다.',
  },
  {
    name: 'placeholder / blurDataURL',
    summary: '로드 전 시각적 placeholder를 제공합니다.',
    useWhen:
      '체감 로딩 개선이 필요할 때 쓰며, blur는 blurDataURL 조건을 함께 확인합니다.',
  },
  {
    name: 'quality',
    summary: 'Next 이미지 최적화 결과물의 압축 품질을 조절합니다.',
    useWhen:
      '해상도 부족이 아니라 압축으로 디테일이 뭉개질 때만 제한적으로 올립니다.',
  },
]

const warningNotes: WarningNote[] = [
  {
    message:
      'Image with src "..." was detected as the Largest Contentful Paint (LCP). Please add the loading="eager" property if this image is above the fold.',
    cause:
      '브라우저가 해당 이미지를 LCP 요소로 판단했는데 lazy 로딩 상태라 초기 렌더링에 늦게 참여할 수 있습니다.',
    fix: 'above the fold라면 loading="eager" 또는 fetchPriority="high"를 비교하고, 단일 hero 이미지라면 preload도 실험합니다.',
  },
  {
    message: 'Image with src "..." has fill but is missing sizes prop.',
    cause:
      'fill 이미지는 렌더링 폭이 CSS에 의해 결정되므로, sizes가 없으면 브라우저가 100vw로 가정할 수 있습니다.',
    fix: '실제 레이아웃 폭에 맞춰 sizes="(max-width: 768px) 100vw, 50vw"처럼 작성합니다.',
  },
  {
    message: 'Image is missing required width or height property.',
    cause:
      '정적 import나 fill이 아닌데 intrinsic size가 없어 이미지 비율을 미리 예약할 수 없습니다.',
    fix: 'width와 height를 둘 다 제공하고, CSS로 너비를 바꿀 때는 height: auto 패턴을 확인합니다.',
  },
  {
    message:
      '"hostname" is not configured under images in your next.config.js.',
    cause:
      '외부 이미지를 next/image로 최적화하려는데 해당 원격 호스트가 허용 목록에 없습니다.',
    fix: 'next.config에 images.remotePatterns를 명시합니다. 이 실험은 별도 카드로 확장합니다.',
  },
]

const checklist = [
  '동일 이미지에 loading="lazy"와 loading="eager"를 바꿔 LCP 경고 변화를 확인한다.',
  'fill 이미지에서 sizes 제거/추가 시 dev console 경고와 네트워크 요청 크기를 비교한다.',
  'width/height가 있는 fixed 이미지와 fill 이미지의 레이아웃 시프트 차이를 확인한다.',
  '작은 width 값을 크게 렌더링했을 때와 원본 크기에 가까운 width 값을 썼을 때 선명도를 비교한다.',
  'preload, fetchPriority="high", loading="eager"를 동시에 쓰지 않고 케이스별로 하나씩 비교한다.',
  '원격 이미지는 remotePatterns 실험 카드에서 별도 재현한다.',
]

const goodExamples: GoodExample[] = [
  {
    title: '1. public 이미지 기본형',
    bestFor:
      '이미지의 실제 크기를 알고 있고, 카드/본문 이미지처럼 레이아웃 크기가 비교적 명확한 경우',
    code: `<Image
  src="/images/next-image/next_image_01.png"
  alt="실험실에서 플라스크를 들고 있는 연구원 캐릭터"
  width={1408}
  height={768}
/>`,
  },
  {
    title: '2. 반응형 카드 이미지',
    bestFor:
      '부모 박스 비율에 맞춰 꽉 채우는 썸네일, 카드 커버, 섹션 배경 이미지',
    code: `<div className="relative aspect-video overflow-hidden rounded-2xl">
  <Image
    src="/images/next-image/next_image_01.png"
    alt="실험실에서 플라스크를 들고 있는 연구원 캐릭터"
    fill
    sizes="(max-width: 768px) 100vw, 50vw"
    className="object-cover"
  />
</div>`,
  },
  {
    title: '3. 첫 화면 LCP 후보 이미지',
    bestFor:
      '페이지 진입 직후 보이는 hero 이미지처럼 LCP가 될 가능성이 높은 이미지',
    code: `<Image
  src="/images/next-image/next_image_01.png"
  alt="실험실에서 플라스크를 들고 있는 연구원 캐릭터"
  width={1408}
  height={768}
  loading="eager"
  fetchPriority="high"
/>`,
  },
  {
    title: '4. 장식용 이미지',
    bestFor:
      '텍스트 의미를 보충하지 않는 패턴, 아이콘, 배경 장식처럼 스크린 리더가 읽지 않아도 되는 이미지',
    code: `<Image
  src="/images/next-image/next_image_01.png"
  alt=""
  aria-hidden="true"
  width={320}
  height={175}
/>`,
  },
]

const resolutionExamples: ResolutionExample[] = [
  {
    title: '흐려질 수 있는 예시',
    summary:
      '작은 intrinsic width를 주고 CSS로 크게 렌더링하면 브라우저가 작은 후보 이미지를 확대해서 보여줄 수 있습니다.',
    code: `<Image
  src="/images/next-image/next_image_01.png"
  alt="작은 후보 이미지를 크게 렌더링한 예시"
  width={360}
  height={196}
  className="h-auto w-full"
/>`,
  },
  {
    title: '더 선명한 예시',
    summary:
      '실제 렌더링 크기와 고해상도 디스플레이를 고려해 충분히 큰 width/height를 주면 더 큰 srcset 후보를 받을 수 있습니다.',
    code: `<Image
  src="/images/next-image/next_image_01.png"
  alt="충분한 해상도 후보를 제공한 예시"
  width={1408}
  height={768}
  className="h-auto w-full"
/>`,
  },
  {
    title: '압축 품질 조정 예시',
    summary:
      '픽셀 수는 충분한데 색 경계나 질감이 뭉개지면 quality를 올려 압축 손실을 줄입니다.',
    code: `<Image
  src="/images/next-image/next_image_01.png"
  alt="압축 품질을 올린 예시"
  width={1408}
  height={768}
  quality={90}
/>`,
  },
]

export const metadata = {
  title: 'Next.js Image Experiment',
  description: 'Next.js Image 컴포넌트 props와 경고 메시지 실험 노트',
}

export default function NextImageExperimentPage() {
  return (
    <div className="min-h-full bg-[#f7f3ea] text-zinc-950">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-8 sm:px-10 lg:px-12">
        <Link
          href="/"
          className="w-fit rounded-full border border-zinc-950/10 bg-white px-4 py-2 text-sm font-bold text-zinc-700 transition hover:border-zinc-950/30 hover:text-zinc-950"
        >
          ← 실험 보드로 돌아가기
        </Link>

        <section className="grid overflow-hidden rounded-4xl border border-zinc-950/10 bg-zinc-950 text-white shadow-2xl shadow-zinc-950/15 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="p-8 sm:p-10">
            <p className="mb-4 inline-flex rounded-full border border-amber-200/30 px-3 py-1 text-xs font-bold tracking-[0.28em] text-amber-200 uppercase">
              Experiment 01
            </p>
            <h1 className="text-4xl font-black tracking-tighter sm:text-6xl">
              Next.js Image 컴포넌트 실험 노트
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-300">
              개발 중 자주 만나는 LCP, sizes, width/height, 원격 이미지 경고를
              props 사용 기준과 함께 정리합니다. 제공된 실험 이미지를 실제로
              렌더링하면서 경고 메시지를 관찰합니다.
            </p>
          </div>

          <div className="relative min-h-80 border-t border-white/10 bg-white/5 lg:border-t-0 lg:border-l">
            <Image
              src={experimentImageSrc}
              alt={experimentImageAlt}
              width={experimentImageWidth}
              height={experimentImageHeight}
              className="h-full w-full object-cover opacity-85"
            />
            <div className="absolute right-8 bottom-8 left-8 rounded-3xl border border-white/10 bg-black/55 p-5 backdrop-blur">
              <p className="text-xs font-bold tracking-[0.24em] text-amber-200 uppercase">
                Intentional Case
              </p>
              <p className="mt-3 text-2xl font-black tracking-tight">
                LCP 후보 이미지를 기본 lazy 상태로 둔 케이스
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-4xl border border-rose-200 bg-rose-50 p-6 sm:p-8">
          <div className="mb-6">
            <p className="text-sm font-bold tracking-[0.24em] text-rose-700 uppercase">
              Live Warning Reproduction
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight">
              실제 이미지로 경고 확인하기
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-rose-900/80">
              이 섹션은 경고를 관찰하기 위해 일부러 권장 속성을 빼둔
              케이스입니다. dev 서버 터미널 또는 브라우저 콘솔에서 메시지를
              확인한 뒤, 아래 기준 패턴과 비교하세요.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <article className="rounded-3xl border border-rose-200 bg-white p-4">
              <p className="mb-3 font-mono text-xs font-bold tracking-[0.2em] text-rose-700 uppercase">
                Case A: LCP candidate without eager
              </p>
              <Image
                src={experimentImageSrc}
                alt="loading eager가 빠진 LCP 후보 이미지"
                width={experimentImageWidth}
                height={experimentImageHeight}
                className="rounded-2xl border border-zinc-950/10"
              />
              <p className="mt-3 text-sm leading-6 text-zinc-700">
                화면 첫 영역에서 가장 큰 이미지가 되면 LCP 관련 경고를 확인할 수
                있습니다.
              </p>
            </article>

            <article className="rounded-3xl border border-rose-200 bg-white p-4">
              <p className="mb-3 font-mono text-xs font-bold tracking-[0.2em] text-rose-700 uppercase">
                Case B: fill without sizes
              </p>
              <div className="relative aspect-video overflow-hidden rounded-2xl border border-zinc-950/10">
                <Image
                  src={experimentImageSrc}
                  alt="sizes가 빠진 fill 이미지"
                  fill
                  className="object-cover"
                />
              </div>
              <p className="mt-3 text-sm leading-6 text-zinc-700">
                fill을 쓰면서 sizes를 생략했기 때문에 sizes 누락 경고를 관찰하는
                케이스입니다.
              </p>
            </article>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <article className="rounded-3xl border border-zinc-950/10 bg-white p-6">
            <p className="text-sm font-bold tracking-[0.2em] text-amber-700 uppercase">
              Key Question
            </p>
            <h2 className="mt-3 text-2xl font-black tracking-tight">
              이 이미지는 화면 첫 영역인가?
            </h2>
            <p className="mt-3 text-sm leading-6 text-zinc-600">
              LCP 후보라면 lazy 기본값보다 eager, fetchPriority, preload의
              차이를 먼저 확인합니다.
            </p>
          </article>
          <article className="rounded-3xl border border-zinc-950/10 bg-white p-6">
            <p className="text-sm font-bold tracking-[0.2em] text-sky-700 uppercase">
              Layout
            </p>
            <h2 className="mt-3 text-2xl font-black tracking-tight">
              크기를 브라우저가 예측할 수 있는가?
            </h2>
            <p className="mt-3 text-sm leading-6 text-zinc-600">
              width/height 또는 fill+부모 비율을 통해 이미지 공간을 미리
              예약해야 CLS를 줄일 수 있습니다.
            </p>
          </article>
          <article className="rounded-3xl border border-zinc-950/10 bg-white p-6">
            <p className="text-sm font-bold tracking-[0.2em] text-emerald-700 uppercase">
              Network
            </p>
            <h2 className="mt-3 text-2xl font-black tracking-tight">
              실제 다운로드 크기가 적절한가?
            </h2>
            <p className="mt-3 text-sm leading-6 text-zinc-600">
              fill 또는 반응형 CSS를 쓰면 sizes가 srcset 선택에 직접 영향을
              줍니다.
            </p>
          </article>
        </section>

        <section className="rounded-4xl border border-zinc-950/10 bg-white p-6 sm:p-8">
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-bold tracking-[0.24em] text-zinc-500 uppercase">
                Props
              </p>
              <h2 className="mt-2 text-3xl font-black tracking-tight">
                먼저 확인할 Image props
              </h2>
            </div>
            <a
              href="https://nextjs.org/docs/app/api-reference/components/image"
              target="_blank"
              rel="noreferrer"
              className="text-sm font-bold text-zinc-950 underline decoration-amber-400 decoration-2 underline-offset-4"
            >
              Next.js Image 문서
            </a>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {propNotes.map((prop) => (
              <article
                key={prop.name}
                className="rounded-2xl border border-zinc-950/10 bg-[#faf8f2] p-5"
              >
                <h3 className="font-mono text-lg font-black text-zinc-950">
                  {prop.name}
                </h3>
                <p className="mt-3 text-sm leading-6 text-zinc-700">
                  {prop.summary}
                </p>
                <p className="mt-4 rounded-xl bg-white px-3 py-2 text-xs leading-5 font-semibold text-zinc-600">
                  {prop.useWhen}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-4xl border border-zinc-950/10 bg-[#fff7df] p-6 sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <p className="text-sm font-bold tracking-[0.24em] text-amber-700 uppercase">
                Resolution Lab
              </p>
              <h2 className="mt-2 text-3xl font-black tracking-tight">
                이미지가 깨져 보일 때 width를 키우면 왜 선명해질까?
              </h2>
              <div className="mt-5 space-y-3 text-sm leading-6 text-zinc-700">
                <p>
                  `width`와 `height`는 화면에 그릴 CSS 크기라기보다, Next가 어떤
                  해상도의 최적화 이미지를 만들지 판단하는 기준입니다.
                  브라우저는 여기서 만들어진 `srcset` 후보 중 현재 화면 폭과
                  DPR에 맞는 파일을 고릅니다.
                </p>
                <p>
                  예를 들어 700px 너비로 보이는 이미지를 `width={360}` 후보로
                  받으면 브라우저가 이미지를 늘려 그리면서 흐려질 수 있습니다.
                  반대로 원본에 가까운 `width={1408}`을 주면 더 큰 후보가 생겨
                  고해상도 화면에서도 덜 뭉개집니다.
                </p>
                <p>
                  단, 무조건 크게 주는 것이 정답은 아닙니다. 파일이 커져 LCP와
                  네트워크 비용이 늘 수 있으니, 실제 렌더링 크기의 1x-2x 정도를
                  기준으로 잡고 `sizes`와 함께 확인합니다.
                </p>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="grid gap-4">
                <article className="rounded-3xl border border-amber-200 bg-white p-4">
                  <p className="mb-3 font-mono text-xs font-bold tracking-[0.2em] text-amber-700 uppercase">
                    Small candidate stretched
                  </p>
                  <Image
                    src={experimentImageSrc}
                    alt="작은 후보 이미지를 크게 렌더링한 예시"
                    width={360}
                    height={196}
                    className="h-auto w-full rounded-2xl border border-zinc-950/10"
                  />
                  <p className="mt-3 text-xs leading-5 text-zinc-600">
                    width는 작지만 CSS로 카드 너비까지 늘려서 보여주는 케이스
                  </p>
                </article>

                <article className="rounded-3xl border border-emerald-200 bg-white p-4">
                  <p className="mb-3 font-mono text-xs font-bold tracking-[0.2em] text-emerald-700 uppercase">
                    Larger candidate
                  </p>
                  <Image
                    src={experimentImageSrc}
                    alt="충분한 해상도 후보를 제공한 예시"
                    width={experimentImageWidth}
                    height={experimentImageHeight}
                    className="h-auto w-full rounded-2xl border border-zinc-950/10"
                  />
                  <p className="mt-3 text-xs leading-5 text-zinc-600">
                    원본 크기에 가까운 후보를 제공해서 확대 손실을 줄이는 케이스
                  </p>
                </article>
              </div>

              <div className="grid gap-4">
                {resolutionExamples.map((example) => (
                  <article
                    key={example.title}
                    className="overflow-hidden rounded-2xl border border-zinc-950/10 bg-zinc-950"
                  >
                    <div className="border-b border-white/10 px-4 py-3">
                      <h3 className="text-sm font-bold text-amber-200">
                        {example.title}
                      </h3>
                      <p className="mt-2 text-xs leading-5 text-zinc-400">
                        {example.summary}
                      </p>
                    </div>
                    <pre className="overflow-x-auto p-4 text-xs leading-6 text-zinc-100">
                      <code>{example.code}</code>
                    </pre>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-4xl border border-zinc-950/10 bg-white p-6 sm:p-8">
            <p className="text-sm font-bold tracking-[0.24em] text-zinc-500 uppercase">
              Examples
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight">
              정석 예시
            </h2>
            <p className="mt-3 text-sm leading-6 text-zinc-600">
              먼저 `width`와 `height`로 이미지 비율을 보장하고, 반응형 `fill`
              이미지에는 `sizes`를 함께 둡니다. 첫 화면의 LCP 후보만
              `loading=&quot;eager&quot;`와 `fetchPriority=&quot;high&quot;`를
              검토합니다.
            </p>
            <div className="mt-6 flex flex-col gap-4">
              {goodExamples.map((example) => (
                <article
                  key={example.title}
                  className="overflow-hidden rounded-2xl border border-zinc-950/10 bg-zinc-950"
                >
                  <div className="border-b border-white/10 px-4 py-3">
                    <h3 className="text-sm font-bold text-amber-200">
                      {example.title}
                    </h3>
                    <p className="mt-2 text-xs leading-5 text-zinc-400">
                      {example.bestFor}
                    </p>
                  </div>
                  <pre className="overflow-x-auto p-4 text-xs leading-6 text-zinc-100">
                    <code>{example.code}</code>
                  </pre>
                </article>
              ))}
            </div>
          </div>

          <div className="rounded-4xl border border-zinc-950/10 bg-white p-6 sm:p-8">
            <p className="text-sm font-bold tracking-[0.24em] text-zinc-500 uppercase">
              Warnings
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight">
              자주 만나는 경고와 해결 방향
            </h2>
            <div className="mt-6 flex flex-col gap-4">
              {warningNotes.map((warning) => (
                <article
                  key={warning.message}
                  className="rounded-2xl border border-zinc-950/10 bg-[#faf8f2] p-5"
                >
                  <p className="font-mono text-xs leading-5 text-rose-700">
                    {warning.message}
                  </p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div>
                      <h3 className="text-xs font-black tracking-[0.2em] text-zinc-500 uppercase">
                        Cause
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-zinc-700">
                        {warning.cause}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-xs font-black tracking-[0.2em] text-zinc-500 uppercase">
                        Fix
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-zinc-700">
                        {warning.fix}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-4xl border border-zinc-950/10 bg-zinc-950 p-6 text-white sm:p-8">
          <p className="text-sm font-bold tracking-[0.24em] text-amber-200 uppercase">
            Test Checklist
          </p>
          <h2 className="mt-2 text-3xl font-black tracking-tight">
            다음 실험에서 확인할 항목
          </h2>
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {checklist.map((item, index) => (
              <div
                key={item}
                className="rounded-2xl border border-white/10 bg-white/5 p-4"
              >
                <span className="font-mono text-sm text-amber-200">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <p className="mt-2 text-sm leading-6 text-zinc-200">{item}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
