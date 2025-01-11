import { NextRequest, NextResponse } from 'next/server'

export const middleware = (req: NextRequest) => {
  // const path = req.nextUrl.pathname;
  console.log('req.nextUrl', req.nextUrl.pathname)
  // 如果命中路由"/tag"，则重定向到"/user/6"
  if (req.nextUrl.pathname === '/tag/2') {
    return NextResponse.redirect('/user/6')
  }
  // return new Response('Hello World');
}
