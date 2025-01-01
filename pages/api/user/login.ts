import { NextApiRequest, NextApiResponse } from 'next'
import { withIronSessionApiRoute } from 'iron-session/next'
import { Cookie } from 'next-cookie'
import { setCookie } from 'utils'
import { ironOptions } from 'config'
import { prepareConnection } from 'db'
import { ISession } from '..'
import { User, UserAuth } from 'db/entity'

async function login(req: NextApiRequest, res: NextApiResponse) {
  const session = req.session as ISession
  const { phone, verifyCode, identity_type = 'phone' } = req.body

  const db = await prepareConnection()
  const userAuthRepo = db.getRepository(UserAuth)
  console.log('session:', session)
  if (verifyCode === String(session.verifyCode)) {
    const userAuth = await userAuthRepo.findOne(
      {
        identity_type,
        identifier: phone,
      },
      { relations: ['user'] }
    )
    const cookie = Cookie.fromApiRoute(req, res);
    if (userAuth) {
      // 已存在用户
      const { user } = userAuth
      const { id, nickname, avatar } = user
      session.id = id
      session.nickname = nickname
      session.avatar = avatar
      await session.save()
      setCookie(cookie, { userId: id, nickname, avatar })
      res.status(200).json({
        code: 0,
        msg: '登录成功',
        data: {
          userId: id,
          nickname,
          avatar,
        }
      })
    } else {
      // 创建用户
      const user = new User()
      const userAuth = new UserAuth()
      user.nickname = `用户_${Math.random().toString(36).substr(2, 5)}`
      user.avatar = '/images/avatar.png'
      user.job = '暂无'
      user.introduce = 'xxxxx'
      userAuth.identity_type = identity_type
      userAuth.identifier = phone
      userAuth.credential = session.verifyCode
      userAuth.user = user
      const resUserAuth = await userAuthRepo.save(userAuth)
      const { id, nickname, avatar } = resUserAuth.user
      session.id = id
      session.nickname = nickname
      session.avatar = avatar
      await session.save()
      setCookie(cookie, { userId: id, nickname, avatar })
      res.status(200).json({
        code: 0,
        msg: '登录成功',
        data: {
          userId: id,
          nickname,
          avatar,
        }
      })
      console.log('resUserAuth:', resUserAuth)
    }
  } else {
    res.status(200).json({
      code: -1,
      msg: '验证码错误',
    })
  }
  // res.status(200).json({
  //   phone,
  //   verifyCode,
  //   code: 0,
  // })
}

export default withIronSessionApiRoute(login, ironOptions)
