import Link from "next/link";

type ExperimentCard = {
  title: string;
  description: string;
  href?: string;
  status: string;
  tags: string[];
};

type KanbanColumn = {
  title: string;
  eyebrow: string;
  accent: string;
  cards: ExperimentCard[];
};

const kanbanColumns: KanbanColumn[] = [
  {
    title: "In Progress",
    eyebrow: "Experiment 01",
    accent: "border-amber-300 bg-amber-50 text-amber-950",
    cards: [
      {
        title: "Next.js Image Component",
        description:
          "Image props, LCP 경고, sizes 누락, eager/preload 선택 기준을 한 곳에서 정리합니다.",
        href: "/experiments/next-image",
        status: "설계 완료",
        tags: ["next/image", "LCP", "sizes", "loading"],
      },
    ],
  },
  {
    title: "Planned",
    eyebrow: "Backlog",
    accent: "border-sky-300 bg-sky-50 text-sky-950",
    cards: [
      {
        title: "Remote Image Patterns",
        description:
          "외부 이미지 도메인, remotePatterns, optimizer 응답 오류를 분리해서 실험할 예정입니다.",
        status: "대기",
        tags: ["remotePatterns", "next.config"],
      },
      {
        title: "Responsive Media Layout",
        description:
          "fill 이미지와 CSS aspect-ratio 조합에서 레이아웃 시프트가 어떻게 달라지는지 확인합니다.",
        status: "대기",
        tags: ["fill", "aspect-ratio", "CLS"],
      },
    ],
  },
  {
    title: "Notes",
    eyebrow: "Research",
    accent: "border-zinc-300 bg-zinc-100 text-zinc-950",
    cards: [
      {
        title: "Warning Archive",
        description:
          "개발 서버와 브라우저 콘솔에서 발견한 Image 관련 메시지를 계속 누적합니다.",
        status: "수집 중",
        tags: ["console", "dev server"],
      },
    ],
  },
];

export default function Home() {
  return (
    <div className="min-h-full bg-[#f3f0e8] text-zinc-950">
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-10 sm:px-10 lg:px-12">
        <section className="overflow-hidden rounded-4xl border border-zinc-950/10 bg-[#111111] p-8 text-white shadow-2xl shadow-zinc-950/15 sm:p-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="mb-4 inline-flex rounded-full border border-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-amber-200">
                Frontend Lab Board
              </p>
              <h1 className="text-4xl font-black tracking-tighter text-white sm:text-6xl">
                실험을 카드로 쌓아두는 Next.js 테스트 보드
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-300 sm:text-lg">
                첫 번째 실험은 Next.js의 Image 컴포넌트입니다. props,
                성능 경고, 브라우저 콘솔 메시지를 하나씩 검증하며 정리합니다.
              </p>
            </div>
            <div className="grid min-w-52 grid-cols-2 gap-3 rounded-3xl border border-white/10 bg-white/5 p-4 text-sm backdrop-blur">
              <span className="text-zinc-400">Active</span>
              <strong className="text-right text-amber-200">1</strong>
              <span className="text-zinc-400">Backlog</span>
              <strong className="text-right text-sky-200">2</strong>
              <span className="text-zinc-400">Notes</span>
              <strong className="text-right text-zinc-100">1</strong>
            </div>
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-3">
          {kanbanColumns.map((column) => (
            <div
              key={column.title}
              className="rounded-3xl border border-zinc-950/10 bg-white/80 p-4 shadow-xl shadow-zinc-950/5"
            >
              <div
                className={`mb-4 rounded-2xl border px-4 py-3 ${column.accent}`}
              >
                <p className="text-xs font-bold uppercase tracking-[0.24em] opacity-70">
                  {column.eyebrow}
                </p>
                <h2 className="mt-1 text-xl font-black tracking-tight">
                  {column.title}
                </h2>
              </div>

              <div className="flex flex-col gap-3">
                {column.cards.map((card) => {
                  const cardContent = (
                    <>
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="text-lg font-black tracking-tight">
                          {card.title}
                        </h3>
                        <span className="shrink-0 rounded-full bg-zinc-950 px-2.5 py-1 text-[11px] font-bold text-white">
                          {card.status}
                        </span>
                      </div>
                      <p className="mt-3 text-sm leading-6 text-zinc-600">
                        {card.description}
                      </p>
                      <div className="mt-5 flex flex-wrap gap-2">
                        {card.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-zinc-950/10 bg-zinc-100 px-2.5 py-1 text-xs font-semibold text-zinc-600"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </>
                  );

                  return card.href ? (
                    <Link
                      key={card.title}
                      href={card.href}
                      className="group block rounded-2xl border border-zinc-950/10 bg-white p-5 transition hover:-translate-y-0.5 hover:border-zinc-950/30 hover:shadow-lg hover:shadow-zinc-950/10"
                    >
                      {cardContent}
                      <span className="mt-5 inline-flex text-sm font-bold text-zinc-950 underline decoration-amber-400 decoration-2 underline-offset-4 group-hover:decoration-zinc-950">
                        실험 문서 열기
                      </span>
                    </Link>
                  ) : (
                    <article
                      key={card.title}
                      className="rounded-2xl border border-dashed border-zinc-950/15 bg-zinc-50 p-5"
                    >
                      {cardContent}
                    </article>
                  );
                })}
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
