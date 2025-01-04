import { NextApiRequest, NextApiResponse } from 'next'
import { withIronSessionApiRoute } from 'iron-session/next'
import { ironOptions } from 'config'
import { prepareConnection } from 'db'
import { ISession } from '..'
import { User, Article, Comments } from 'db/entity'

async function publish(req: NextApiRequest, res: NextApiResponse) {
  const session = req.session as ISession
  const { content, article_id } = req.body
  const db = await prepareConnection()
  const commentRepo = db.getRepository(Comments);
  const user = await db.getRepository(User).findOne({
    id: session?.id,
  });

  const article = await db.getRepository(Article).findOne({
    id: article_id,
  });
  const comment = new Comments()
  comment.content = content
  comment.create_time = new Date()
  comment.update_time = new Date()
  if (user && article) {
    comment.user = user
    comment.article = article
    const resComment = await commentRepo.save(comment)
    res.status(200).json({
      code: 0,
      msg: '发布成功',
      data: resComment,
    })
  } else {
    res.status(200).json({
      code: 1,
      msg: '用户不存在 或 文章不存在',
    })
  }
  // res.status(200).json({
  //   phone,
  //   verifyCode,
  //   code: 0,
  // })
}

export default withIronSessionApiRoute(publish, ironOptions)
