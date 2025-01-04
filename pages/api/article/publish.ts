import { NextApiRequest, NextApiResponse } from 'next'
import { withIronSessionApiRoute } from 'iron-session/next'
import { ironOptions } from 'config'
import { prepareConnection } from 'db'
import { ISession } from '..'
import { User, Article, Tag } from 'db/entity'

async function publish(req: NextApiRequest, res: NextApiResponse) {
  const session = req.session as ISession
  const { title, content, tagIds } = req.body

  const db = await prepareConnection()
  const userRepo = db.getRepository(User)
  const articleRepo = db.getRepository(Article)
  const tagRepo = db.getRepository(Tag)
  const user = await userRepo.findOne({ id: session.id })
  const tags= await tagRepo.findByIds(tagIds)
  const article = new Article()
  article.title = title
  article.content = content
  article.views = 0
  article.create_time = new Date()
  article.update_time = new Date()
  article.is_delete = 0
  if (user) {
    if (tags) {
      tags.forEach((tag) => {
        tag.article_count += 1
      })
      article.tags = tags
    }
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
