import { NextApiRequest, NextApiResponse } from 'next'
import { withIronSessionApiRoute } from 'iron-session/next'
import { ironOptions } from 'config'
import { prepareConnection } from 'db'
import { ISession } from '..'
import { Tag, User } from 'db/entity'

async function follow(req: NextApiRequest, res: NextApiResponse) {
  const session = req.session as ISession
  const { id = 0 } = session // 用户id  从session中获取
  console.log('id', id)
  const { type, tagId } = req.body
  const db = await prepareConnection()
  const userRepo = db.getRepository(User)
  const tagRepo = db.getRepository(Tag)
  const user = await userRepo.findOne({
    where: {
      id,
    }
  })
  const followTag = await tagRepo.findOne({
    relations: ['users'],
    where: {
      id: tagId,
    },
  })
  console.log('followTag', user, followTag)
  if (!user) {
    res.status(200).json({
      code: 1,
      msg: '用户不存在',
    })
    return
  }
  if (followTag) {
    if (type === 'follow') {
      followTag.users.push(user)
      followTag.follow_count += 1
    } else {
      followTag.users = followTag.users.filter((u) => u.id !== user.id)
      followTag.follow_count -= 1
    }
    await tagRepo.save(followTag)
    res.status(200).json({
      code: 0,
      msg: '操作成功',
    })
  } else {
    res.status(200).json({
      code: 1,
      msg: '标签不存在',
    })
  }
  // res.status(200).json({
  //   phone,
  //   verifyCode,
  //   code: 0,
  // })
}

export default withIronSessionApiRoute(follow, ironOptions)
