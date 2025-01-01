import '../styles/globals.css'
// import type { AppProps } from 'next/app'
import Layout from 'components/layout'
import { StoreProvider } from 'store'
import { NextPage } from 'next'

interface IMyAppProps {
  initialValue: Record<string, any>
  Component: NextPage
  pageProps: any
}

function MyApp({ initialValue, Component, pageProps }: IMyAppProps) {
  return (
    <StoreProvider initialValue={initialValue}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </StoreProvider>
  )
}

MyApp.getInitialProps = async ({ ctx }: { ctx: any }) => {
  const { userId, nickname, avatar } = ctx?.req.cookies || {}
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
