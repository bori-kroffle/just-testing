// 노션 글의 D1 조회 대신 메모리 목 데이터로 같은 커서 규칙을 재현한다.

export type ProductCategory = 'recommend' | 'munhwa_nuri' | 'healing'
export type ProductDuration = 'day' | 'one_night' | 'two_nights'

export const productCategoryLabels: Record<ProductCategory, string> = {
  recommend: '추천여행',
  munhwa_nuri: '문화누리여행',
  healing: '힐링센터',
}

export const productDurationLabels: Record<ProductDuration, string> = {
  day: '당일',
  one_night: '1박 2일',
  two_nights: '2박 3일',
}

// 한 번에 불러올 상품 개수
export const PRODUCT_PAGE_SIZE = 9

export const isProductCategory = (value: unknown): value is ProductCategory =>
  value === 'recommend' || value === 'munhwa_nuri' || value === 'healing'

export const isProductDuration = (value: unknown): value is ProductDuration =>
  typeof value === 'string' && value in productDurationLabels

export const parsePositiveInt = (value: string) => {
  if (!/^\d+$/.test(value)) return null
  const parsed = Number.parseInt(value, 10)
  return parsed > 0 ? parsed : null
}

export type ProductSummary = {
  id: number
  title: string
  category: ProductCategory
  duration: ProductDuration
  price: number
}

type ProductRow = ProductSummary & { isPublished: boolean }

const DURATIONS: ProductDuration[] = ['day', 'one_night', 'two_nights']
const CATEGORIES: ProductCategory[] = ['recommend', 'munhwa_nuri', 'healing']

// id 1~150. 카테고리는 순서대로 돌고, 10번째마다 비공개 상품을 섞는다.
const PRODUCTS: ProductRow[] = Array.from({ length: 150 }, (_, index) => {
  const id = index + 1
  const category = CATEGORIES[index % CATEGORIES.length]
  const duration = DURATIONS[Math.floor(index / 3) % DURATIONS.length]
  return {
    id,
    title: `${productCategoryLabels[category]} 상품 #${id}`,
    category,
    duration,
    price: 30000 + (id % 12) * 10000,
    isPublished: id % 10 !== 0,
  }
})

export type ProductPage = {
  items: ProductSummary[]
  nextCursor: number | null // 다음 요청에 넘길 마지막 상품 id. 없으면 null
}

export const listProductPage = async ({
  category,
  duration,
  cursor,
  limit = PRODUCT_PAGE_SIZE,
}: {
  category: ProductCategory
  duration?: ProductDuration
  cursor?: number // 이 id보다 작은 상품만 조회
  limit?: number
}): Promise<ProductPage> => {
  const pageSize = Math.min(Math.max(limit, 1), PRODUCT_PAGE_SIZE)

  // WHERE category = ? AND is_published = 1 [AND duration = ?] [AND id < ?]
  // ORDER BY id DESC LIMIT pageSize + 1
  const results = PRODUCTS.filter(
    (p) =>
      p.category === category &&
      p.isPublished &&
      (!duration || p.duration === duration) &&
      (!cursor || p.id < cursor),
  )
    .sort((a, b) => b.id - a.id)
    .slice(0, pageSize + 1)

  const hasMore = results.length > pageSize
  const rows = hasMore ? results.slice(0, pageSize) : results
  const lastId = rows.at(-1)?.id

  return {
    items: rows.map(({ isPublished: _, ...summary }) => summary),
    nextCursor: hasMore && lastId ? lastId : null,
  }
}
