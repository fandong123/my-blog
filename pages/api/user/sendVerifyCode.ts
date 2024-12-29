import { NextApiRequest, NextApiResponse } from 'next'
import { withIronSessionApiRoute } from 'iron-session/next'
import { format } from 'date-fns'
import md5 from 'md5'
import { encode } from 'js-base64'
import requetInstance from 'service/fetch'
import { ironOptions } from 'config'
import { ISession } from 'pages/api'

const host = 'https://app.cloopen.com:8883'
const accountSid = '2c94811c93863e4f0194124d04e41d25'
const authToken = '311c66bbcda841dd9b6620889ec4f148'
const appId = '2c94811c93863e4f0194124d06941d2c'
const currentDate = format(new Date(), 'yyyyMMddHHmmss')
const sigParameter = md5(`${accountSid}${authToken}${currentDate}`)
const authorization = encode(`${accountSid}:${currentDate}`)
const verifyCode = Math.floor(Math.random() * 10000)
const expireTime = '5'
async function sendVerifyCode(req: NextApiRequest, res: NextApiResponse) {
  const { to, templateId = '1' } = req.body
  const session: ISession = req.session
  console.log(to)
  console.log(verifyCode)
  console.log(sigParameter)
  console.log(authorization)
  const result = await requetInstance.post(
    `${host}/2013-12-26/Accounts/${accountSid}/SMS/TemplateSMS?sig=${sigParameter}`,
    {
      to,
      appId,
      templateId,
      datas: [verifyCode, expireTime],
    },
    {
      headers: {
        Authorization: authorization,
      },
    }
  )
  const { statusCode, statusMsg, templateSMS } = result as any
  if (statusCode == '000000') {
    session.verifyCode = verifyCode
    await session.save()
    res.status(200).json({
      code: statusCode,
      msg: statusMsg,
      data: templateSMS,
    })
  } else {
    res.status(200).json({
      code: statusCode,
      msg: statusMsg,
    })
  }

}

export default withIronSessionApiRoute(sendVerifyCode, ironOptions)
