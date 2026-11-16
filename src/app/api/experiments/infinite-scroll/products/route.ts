import {
  isProductCategory,
  isProductDuration,
  listProductPage,
  parsePositiveInt,
  PRODUCT_PAGE_SIZE,
} from '@/app/experiments/infinite-scroll/_lib/products'

const wait = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, ms)
  })

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')

  if (!isProductCategory(category)) {
    return Response.json(
      { message: '잘못된 상품 구분입니다.' },
      { status: 400 },
    )
  }

  const durationParam = searchParams.get('duration')
  if (durationParam && !isProductDuration(durationParam)) {
    return Response.json(
      { message: '잘못된 여행 기간입니다.' },
      { status: 400 },
    )
  }

  const cursorParam = searchParams.get('cursor')
  const cursor = cursorParam ? parsePositiveInt(cursorParam) : null
  if (cursorParam && !cursor) {
    return Response.json({ message: '잘못된 페이지입니다.' }, { status: 400 })
  }

  // 실험용: 로딩 문구가 보이도록 약간 지연
  await wait(500)

  const page = await listProductPage({
    category,
    duration:
      durationParam && isProductDuration(durationParam)
        ? durationParam
        : undefined,
    cursor: cursor ?? undefined,
    limit: PRODUCT_PAGE_SIZE,
  })

  return Response.json(page)
}
