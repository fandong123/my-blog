import { NextApiRequest, NextApiResponse } from 'next'
import { withIronSessionApiRoute } from 'iron-session/next'
import { ironOptions } from 'config'
import { prepareConnection } from 'db'
import { Article, Tag } from 'db/entity'

async function update(req: NextApiRequest, res: NextApiResponse) {
  // const session = req.session as ISession
  const { title, content, tagIds = [], id } = req.body

  const db = await prepareConnection()
  // const userRepo = db.getRepository(User)
  const articleRepo = db.getRepository(Article)
  const tagRepo = db.getRepository(Tag)
  const article = await articleRepo.findOne({
    relations: ['tags'],
    where: {
      id,
    },
  })
  const tags = await tagRepo.findByIds(tagIds)
  console.log('article', article)
  // return
  if (article) {
    if (article.tags) {
      article.tags.forEach((tag) => {
        tag.article_count -= 1
      })
      await tagRepo.save(article.tags)
    }
    // await articleRepo.save(article)
    if (tags) {
      tags.forEach((tag) => {
        tag.article_count += 1
      })
      article.tags = tags
    }
    article.title = title
    article.content = content
    article.update_time = new Date()
    const resArticle = await articleRepo.save(article)
    res.status(200).json({
      code: 0,
      msg: '发布成功',
      data: resArticle,
    })
  } else {
    res.status(200).json({
      code: 1,
      msg: '文章不存在',
    })
  }
  // res.status(200).json({
  //   phone,
  //   verifyCode,
  //   code: 0,
  // })
}

export default withIronSessionApiRoute(update, ironOptions)
