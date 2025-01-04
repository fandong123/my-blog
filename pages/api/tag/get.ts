import { NextApiRequest, NextApiResponse } from 'next'
import { withIronSessionApiRoute } from 'iron-session/next'
import { ironOptions } from 'config'
import { prepareConnection } from 'db'
import { ISession } from '..'
import { Tag } from 'db/entity'

async function tagGet(req: NextApiRequest, res: NextApiResponse) {
  const session = req.session as ISession
  const { id } = session // 用户id  从session中获取
  // const { userId = 0 } = req.body
  const db = await prepareConnection()
  const tagRepo = db.getRepository(Tag)
  // const followTags = []
  const followTags = await tagRepo.find({
    relations: ['users'],
    where: (qb: any) => {
      qb.where('user_id = :id', {
        id: Number(id),
      })
    },
  })
  const allTags = await db.getRepository(Tag).find({
    relations: ['users'],
  })
  if (followTags && allTags) {
    // comment.user = user
    // comment.article = article
    // const resComment = await commentRepo.save(comment)
    res.status(200).json({
      code: 0,
      msg: '获取标签列表成功',
      data: { followTags, allTags },
    })
  } else {
    res.status(200).json({
      code: 1,
      msg: '获取标签列表失败',
    })
  }
  // res.status(200).json({
  //   phone,
  //   verifyCode,
  //   code: 0,
  // })
}

export default withIronSessionApiRoute(tagGet, ironOptions)
