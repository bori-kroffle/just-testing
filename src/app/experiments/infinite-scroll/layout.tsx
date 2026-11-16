import type { ReactNode } from 'react'
import QueryProvider from './_components/QueryProvider'

type InfiniteScrollLayoutProps = {
  children: ReactNode
}

export default function InfiniteScrollLayout({
  children,
}: InfiniteScrollLayoutProps) {
  return <QueryProvider>{children}</QueryProvider>
}
