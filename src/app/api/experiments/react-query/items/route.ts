type LabItem = {
  id: string
  title: string
}

const wait = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, ms)
  })

const PAGE_ITEMS: Record<1 | 2, string[]> = {
  1: [
    '캐시는 아직 살아 있습니다',
    'fresh와 stale은 다른 개념입니다',
    '화면은 캐시부터 그립니다',
  ],
  2: [
    '2페이지는 다른 queryKey입니다',
    '1페이지 쿼리는 inactive가 됩니다',
    'gcTime은 이때부터 흐릅니다',
  ],
}

const toItems = (page: 1 | 2): LabItem[] =>
  PAGE_ITEMS[page].map((title, index) => ({
    id: `${page}-${index + 1}`,
    title,
  }))

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url)
  const requestedPage = Number.parseInt(searchParams.get('page') ?? '1', 10)
  const page: 1 | 2 = requestedPage === 2 ? 2 : 1

  if (searchParams.get('fail') === '1') {
    await wait(400)

    return Response.json(
      { message: '실험용으로 일부러 실패한 요청입니다.' },
      { status: 500 },
    )
  }

  await wait(800)

  return Response.json({
    page,
    fetchedAt: new Date().toISOString(),
    requestId: crypto.randomUUID(),
    items: toItems(page),
    note: 'fetchedAt과 requestId가 바뀌면 서버에 다시 다녀온 것입니다.',
  })
}
