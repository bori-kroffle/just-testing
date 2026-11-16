'use client'

import type { ReactNode } from 'react'
import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

type QueryProviderProps = {
  children: ReactNode
}

export default function QueryProvider({ children }: QueryProviderProps) {
  // 브라우저에서 QueryClient 인스턴스를 한 번만 만든다
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false, // 탭 전환 시 자동 재요청 방지
          },
        },
      }),
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* 개발용: pages·pageParams(cursor) 확인 */}
      <ReactQueryDevtools initialIsOpen />
    </QueryClientProvider>
  )
}
