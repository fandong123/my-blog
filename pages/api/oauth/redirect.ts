import { NextApiRequest, NextApiResponse } from 'next'
import { withIronSessionApiRoute } from 'iron-session/next'
import { Cookie } from 'next-cookie'
import { setCookie } from 'utils'
import { ironOptions } from 'config'
import { prepareConnection } from 'db'
import requetInstance from 'service/fetch'
import { ISession } from '..'
import { User, UserAuth } from 'db/entity'

async function login(req: NextApiRequest, res: NextApiResponse) {
  const client_id = 'Ov23libS9zRJsYrRajAI'
  const client_secret = 'da02d6a0347028ef5b4cf6de0fe928468a52c82c'
  const session = req.session as ISession
  const { code } = req.query

  const tokenResponseData: any = await requetInstance.post(
    `https://github.com/login/oauth/access_token?client_id=${client_id}&client_secret=${client_secret}&code=${code}`,
    {},
    {
      headers: {
        accept: 'application/json',
      },
    }
  )

  const { access_token } = tokenResponseData || {}
  console.log('tokenResponseData', tokenResponseData)

  if (access_token) {
    const userResponse: any = await requetInstance.get(
      'https://api.github.com/user',
      {
        headers: {
          Authorization: `token ${access_token}`,
        },
      }
    )
    const { id, login, avatar_url } = userResponse || {}
    console.log('userResponse', userResponse)
    if (id) {
      const db = await prepareConnection()
      const userAuthRepo = db.getRepository(UserAuth)
      const userAuth = await userAuthRepo.findOne(
        {
          identifier: client_id,
          identity_type: 'github',
        },
        { relations: ['user'] }
      )
      const cookie = Cookie.fromApiRoute(req, res)
      console.log('userAuth', userAuth)
      if (userAuth) {
        // 已存在用户
        const { user } = userAuth
        const { id, nickname, avatar } = user
        session.id = id
        session.nickname = nickname
        session.avatar = avatar
        await session.save()
        setCookie(cookie, { userId: id, nickname, avatar })
        res.status(302).redirect('/')
      } else {
        // 创建用户
        const user = new User()
        const userAuth = new UserAuth()
        user.nickname = login
        user.avatar = avatar_url
        user.job = '暂无'
        user.introduce = 'xxxxx'
        userAuth.identity_type = 'github'
        userAuth.identifier = client_id
        userAuth.credential = access_token
        userAuth.user = user
        const resUserAuth = await userAuthRepo.save(userAuth)
        const { id, nickname, avatar } = resUserAuth.user
        session.id = id
        session.nickname = nickname
        session.avatar = avatar
        await session.save()
        setCookie(cookie, { userId: id, nickname, avatar })
        setTimeout(() => {
          res.status(302).redirect('/')
        }, 5000);
      }
    }
  }
}

export default withIronSessionApiRoute(login, ironOptions)
