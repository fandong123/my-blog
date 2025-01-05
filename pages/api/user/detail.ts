import { NextApiRequest, NextApiResponse } from 'next'
import { withIronSessionApiRoute } from 'iron-session/next'
import { ironOptions } from 'config'
import { prepareConnection } from 'db'
import { ISession } from '..'
import { User } from 'db/entity'

async function userDtail(req: NextApiRequest, res: NextApiResponse) {
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
  return res.status(200).json({
    code: 0,
    msg: '获取用户成功',
    data: userInfo,
  })
}

export default withIronSessionApiRoute(userDtail, ironOptions)
