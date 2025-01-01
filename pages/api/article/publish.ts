import { NextApiRequest, NextApiResponse } from 'next'
import { withIronSessionApiRoute } from 'iron-session/next'
import { Cookie } from 'next-cookie'
import { setCookie } from 'utils'
import { ironOptions } from 'config'
import { prepareConnection } from 'db'
import { ISession } from '..'
import { User, Article } from 'db/entity'

async function publish(req: NextApiRequest, res: NextApiResponse) {
  const session = req.session as ISession
  const { title, content } = req.body

  const db = await prepareConnection()
  const userRepo = db.getRepository(User)
  const articleRepo = db.getRepository(Article)
  const user = await userRepo.findOne({ id: session.id })
  const article = new Article()
  article.title = title
  article.content = content
  article.views = 0
  article.create_time = new Date()
  article.update_time = new Date()
  article.is_delete = 0
  console.log('user:', user)
  console.log('article:', article)
  if (user) {
    article.user = user
    const resArticle = await articleRepo.save(article)
    res.status(200).json({
      code: 0,
      msg: '发布成功',
      data: resArticle,
    })
  } else {
    res.status(200).json({
      code: 1,
      msg: '用户不存在',
    })
  }
  // res.status(200).json({
  //   phone,
  //   verifyCode,
  //   code: 0,
  // })
}

export default withIronSessionApiRoute(publish, ironOptions)
