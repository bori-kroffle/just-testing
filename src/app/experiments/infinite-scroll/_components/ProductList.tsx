'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { useInfiniteQuery } from '@tanstack/react-query'
import {
  productDurationLabels,
  type ProductCategory,
  type ProductDuration,
  type ProductPage,
  type ProductSummary,
} from '../_lib/products'

type ProductListProps = {
  category: ProductCategory
  products: ProductSummary[]
  nextCursor: number | null
  basePath: string
  activeDuration: ProductDuration | null
}

const fetchProductPage = async ({
  category,
  duration,
  cursor,
}: {
  category: ProductCategory
  duration?: ProductDuration
  cursor?: number
}): Promise<ProductPage> => {
  const params = new URLSearchParams({ category })

  if (duration) params.set('duration', duration)
  if (cursor) params.set('cursor', String(cursor))

  const response = await fetch(
    `/api/experiments/infinite-scroll/products?${params.toString()}`,
  )
  if (!response.ok) throw new Error('상품을 불러오지 못했습니다.')

  return response.json()
}

export default function ProductList({
  category,
  products,
  nextCursor,
  basePath,
  activeDuration,
}: ProductListProps) {
  const sentinelRef = useRef<HTMLDivElement>(null)

  const productsQuery = useInfiniteQuery({
    // category·기간이 바뀌면 캐시도 분리
    queryKey: ['products', category, activeDuration ?? 'all'],
    queryFn: ({ pageParam }) =>
      fetchProductPage({
        category,
        duration: activeDuration ?? undefined,
        cursor: pageParam ?? undefined,
      }),
    initialPageParam: null as number | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    // SSR로 받은 첫 페이지를 캐시에 시드 → 마운트 직후 재요청 방지
    initialData: {
      pages: [{ items: [...products], nextCursor }],
      pageParams: [null],
    },
    initialDataUpdatedAt: Date.now(),
    staleTime: 60_000,
  })

  const { hasNextPage, isFetchingNextPage, fetchNextPage } = productsQuery

  // 목록 끝 센티널이 보이면 다음 페이지 요청
  useEffect(() => {
    const node = sentinelRef.current
    if (!node || !hasNextPage) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          void fetchNextPage()
        }
      },
      { rootMargin: '240px' },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  const pages = productsQuery.data?.pages ?? []
  const loadedProducts = pages.flatMap((page) => page.items)

  return (
    <>
      <nav className="mb-8 flex flex-wrap gap-2" aria-label="여행 기간">
        <FilterLink href={basePath} active={!activeDuration} label="전체" />
        {(Object.keys(productDurationLabels) as ProductDuration[]).map(
          (duration) => (
            <FilterLink
              key={duration}
              href={`${basePath}?duration=${duration}`}
              active={activeDuration === duration}
              label={productDurationLabels[duration]}
            />
          ),
        )}
      </nav>

      <p
        className="mb-4 text-sm text-zinc-500"
        data-testid="loaded-status"
        aria-live="polite"
      >
        불러온 상품 {loadedProducts.length}개 · 페이지 {pages.length}개 ·
        nextCursor {String(pages.at(-1)?.nextCursor ?? null)}
      </p>

      <ul className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {loadedProducts.map((product) => (
          <li key={product.id}>
            <ProductCard product={product} />
          </li>
        ))}
      </ul>

      {/* IntersectionObserver가 관찰하는 1px 센티널 */}
      <div ref={sentinelRef} className="h-px" aria-hidden="true" />

      {isFetchingNextPage ? (
        <p role="status" className="py-8 text-center text-sm text-zinc-500">
          상품을 더 불러오는 중입니다.
        </p>
      ) : null}
      {!hasNextPage ? (
        <p className="py-8 text-center text-sm text-zinc-400">
          마지막 상품입니다.
        </p>
      ) : null}
      {productsQuery.isFetchNextPageError ? (
        <p role="alert" className="py-8 text-center text-sm text-red-500">
          상품을 불러오지 못했습니다.
        </p>
      ) : null}
    </>
  )
}

function FilterLink({
  href,
  active,
  label,
}: {
  href: string
  active: boolean
  label: string
}) {
  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
        active
          ? 'bg-zinc-900 text-white'
          : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
      }`}
    >
      {label}
    </Link>
  )
}

function ProductCard({ product }: { product: ProductSummary }) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-zinc-200 bg-white p-5">
      <div
        aria-hidden
        className="mb-4 flex aspect-[4/3] items-center justify-center rounded-xl bg-zinc-100 text-3xl font-semibold text-zinc-300"
      >
        #{product.id}
      </div>
      <p className="text-xs font-medium text-zinc-500">
        {productDurationLabels[product.duration]}
      </p>
      <h2 className="mt-1 text-base font-semibold tracking-tight">
        {product.title}
      </h2>
      <p className="mt-2 text-sm text-zinc-600">
        {product.price.toLocaleString('ko-KR')}원
      </p>
    </article>
  )
}
