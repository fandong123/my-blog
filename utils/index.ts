interface ICookeInfo {
  userId: number
  nickname: string
  avatar: string
}
const expires = new Date(Date.now() + 24 * 60 * 60 * 1000)
const path = '/'

export const setCookie = (
  cookies: any,
  { userId, nickname, avatar }: ICookeInfo
) => {
  // 登录时效 24 小时

  cookies.set('userId', userId, { expires, path })
  cookies.set('nickname', nickname, { expires, path })
  cookies.set('avatar', avatar, { expires, path })
}

export const clearCookie = (cookies: any) => {
  cookies.set('userId', '', { expires, path })
  cookies.set('nickname', '', { expires, path })
  cookies.set('avatar', '', { expires, path })
}
