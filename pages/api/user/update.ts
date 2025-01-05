import { NextApiRequest, NextApiResponse } from 'next'
import { withIronSessionApiRoute } from 'iron-session/next'
import { ironOptions } from 'config'
import { prepareConnection } from 'db'
import { ISession } from '..'
import { User } from 'db/entity'

async function updateUser(req: NextApiRequest, res: NextApiResponse) {
  const { nickname, job, introduce } = req.body
  const session = req.session as ISession
  const db = await prepareConnection()
  const userRepo = db.getRepository(User)
  const userInfo = await userRepo.findOne({
    where: {
      id: Number(session?.id),
    },
  })
  if (!userInfo?.id) {
    res.status(200).json({
      code: 1,
      msg: '当前用户不存在',
    })
    return
  }
  userInfo.nickname = nickname;
  userInfo.job = job;
  userInfo.introduce = introduce;
  const newUserInfo = await userRepo.save(userInfo)
  return res.status(200).json({
    code: 0,
    msg: '更新用户成功',
    data: newUserInfo,
  })
}

export default withIronSessionApiRoute(updateUser, ironOptions)
