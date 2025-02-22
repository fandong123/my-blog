import '../styles/globals.css'
// import type { AppProps } from 'next/app'
import Layout from 'components/layout'
import ErrorBoundary from 'components/ErrorBoundary'
import { StoreProvider } from 'store'
import { NextPage } from 'next'

interface IMyAppProps {
  initialValue: Record<string, any>
  Component: NextPage
  pageProps: any
}

// 测试性能
export function reportWebVitals(mertic: any) {
  console.log(mertic)
}

const renderLayout = (Component: NextPage, pageProps: any) => {
  if ((Component as any).layout === null) {
    return <Component {...pageProps} />
  }
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}

function MyApp({ initialValue, Component, pageProps }: IMyAppProps) {
  return (
    <ErrorBoundary>
      <StoreProvider initialValue={initialValue}>
        {renderLayout(Component, pageProps)}
      </StoreProvider>
    </ErrorBoundary>
  )
}

MyApp.getInitialProps = async ({ ctx }: { ctx: any }) => {
  const { userId, nickname, avatar } = ctx?.req?.cookies || {}
  return {
    initialValue: {
      user: {
        userInfo: {
          userId,
          nickname,
          avatar,
        },
      },
    },
  }
}

export default MyApp
