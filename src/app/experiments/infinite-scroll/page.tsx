import Link from 'next/link'
import ProductList from './_components/ProductList'
import { isProductDuration, listProductPage } from './_lib/products'

type InfiniteScrollPageProps = {
  searchParams: Promise<{ duration?: string }>
}

export default async function InfiniteScrollPage({
  searchParams,
}: InfiniteScrollPageProps) {
  const { duration } = await searchParams
  const activeDuration = isProductDuration(duration) ? duration : null

  // 서버에서 첫 페이지만 조회
  const productPage = await listProductPage({
    category: 'recommend',
    duration: activeDuration ?? undefined,
  })

  return (
    <div className="bg-background text-foreground min-h-full">
      <main className="mx-auto w-full max-w-5xl px-6 py-16 sm:px-8">
        <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-800">
          ← 실험 목록
        </Link>
        <header className="mt-6 mb-8 flex flex-col gap-3">
          <h1 className="text-3xl font-semibold tracking-tight">
            상품 무한 스크롤
          </h1>
          <p className="max-w-2xl text-base leading-7 text-zinc-600">
            첫 9개는 서버 컴포넌트에서 조회하고, 이후는 useInfiniteQuery가 id
            커서로 9개씩 이어 붙입니다. 목 데이터 추천여행 카테고리입니다.
          </p>
        </header>

        <ProductList
          // 기간이 바뀌면 initialData를 새로 받도록 리마운트
          key={activeDuration ?? 'all'}
          category="recommend"
          products={productPage.items}
          nextCursor={productPage.nextCursor}
          basePath="/experiments/infinite-scroll"
          activeDuration={activeDuration}
        />
      </main>
    </div>
  )
}
