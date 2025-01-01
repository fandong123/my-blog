import { NextApiRequest, NextApiResponse } from 'next'
import { withIronSessionApiRoute } from 'iron-session/next'
import { Cookie } from 'next-cookie'
import { clearCookie } from 'utils'
import { ironOptions } from 'config'
import { ISession } from '..'

async function logout(req: NextApiRequest, res: NextApiResponse) {
  const session = req.session as ISession
  const cookie = Cookie.fromApiRoute(req, res)
  clearCookie(cookie)
  await session.destroy()
  res.status(200).json({
    code: 0,
    msg: '退出成功',
    data: null,
  })
}

export default withIronSessionApiRoute(logout, ironOptions)
