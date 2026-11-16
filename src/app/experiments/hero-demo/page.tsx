import Link from "next/link";
import HeroDemo from "./_components/HeroDemo";

export default function HeroDemoPage() {
  return (
    <div className="min-h-full bg-white text-zinc-900">
      <main className="mx-auto w-full max-w-6xl px-6 py-16 sm:px-8">
        <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-800">
          ← 실험 목록
        </Link>

        <section className="mt-10 grid items-center gap-10 lg:grid-cols-[minmax(280px,360px)_minmax(0,720px)]">
          <header className="flex flex-col gap-4">
            <p className="text-sm font-medium text-zinc-500">홈페이지 히어로</p>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              화면 위의 피드백을 메모로 남깁니다
            </h1>
            <p className="max-w-md text-base leading-7 text-zinc-600">
            보내기 버튼을 짚고, 사이드 아이콘을 감싸고, 제목을 고른 뒤 메모
            창에 붙입니다. 한 바퀴가 끝나면 처음부터 다시 이어집니다.
            </p>
          </header>
          <HeroDemo />
        </section>
      </main>
    </div>
  );
}
