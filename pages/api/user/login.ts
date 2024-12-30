import { NextApiRequest, NextApiResponse } from 'next'
import { withIronSessionApiRoute } from 'iron-session/next'
import { ironOptions } from 'config'
import { prepareConnection } from 'db'
import { User } from 'db/entity'

async function login(req: NextApiRequest, res: NextApiResponse) {
  const { phone, verifyCode } = req.body

  const db = await prepareConnection()
  const userRepo = db.getRepository(User)
  const res1 = await userRepo.find()
  console.log('res1:', res1)
  res.status(200).json({
    phone,
    verifyCode,
    code: 0,
  })
}

export default withIronSessionApiRoute(login, ironOptions)
