import type { NextPage } from 'next'
import { Form, Modal, Input, Button, message } from 'antd'
import { useState } from 'react'
import CutDown from '../CutDown'
import requestInstance from 'service/fetch'
import { useStore } from 'store'

interface Iprops {
  isShow: boolean
  onClose: () => void
}
const Login: NextPage<Iprops> = (props) => {
  const { isShow, onClose } = props
  const [isShowVerifyCode, setIsShowVerifyCode] = useState(false)
  const [loginLoading, setLoginLoading] = useState(false)
  const [form] = Form.useForm()
  const store = useStore()

  const handleGetVerifyCode = async () => {
    // setIsShowVerifyCode(true)
    const formValue = await form.validateFields(['phone'])
    const res: any = await requestInstance.post('/api/user/sendVerifyCode', {
      to: formValue?.phone,
      templateId: '1',
    })
    if (res?.code === '0000') {
      setIsShowVerifyCode(true)
    } else {
      message.error(res?.msg || '发送失败')
    }
    //  const
  }

  const handleVerifyCodeEnd = () => {
    setIsShowVerifyCode(false)
  }

  const handleLogin = async () => {
    const formValue = await form.validateFields()
    setLoginLoading(true)
    try {
      const res: any = await requestInstance.post('/api/user/login', {
        ...formValue,
        identity_type: 'phone',
      })
      console.log(res)
      if (res?.code === 0) {
        store.user.setUserInfo(res?.data)
        console.log(store)
        message.success('登录成功')
        onClose()
      } else {
        message.error(res?.msg || '登录失败')
      }
    } finally {
      setLoginLoading(false)
    }
  }

  return (
    <Modal
      title="手机号登录"
      visible={isShow}
      onCancel={onClose}
      onOk={onClose}
    >
      <Form form={form}>
        <Form.Item
          name="phone"
          rules={[{ required: true, message: '请输入手机号' }]}
        >
          <Input placeholder="请输入手机号" size="large"></Input>
        </Form.Item>
        <Form.Item
          name="verifyCode"
          rules={[{ required: true, message: '请输入验证码' }]}
        >
          <Input
            placeholder="请输入验证码"
            size="large"
            suffix={
              isShowVerifyCode ? (
                <CutDown time={10} onEnd={handleVerifyCodeEnd} />
              ) : (
                <a type="text" onClick={handleGetVerifyCode}>
                  获取验证码
                </a>
              )
            }
          ></Input>
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            block
            shape="round"
            loading={loginLoading}
            onClick={handleLogin}
          >
            登录
          </Button>
        </Form.Item>
      </Form>
      <div>
        <div>
          <a>使用 Github 登录</a>
        </div>
        <div>
          注册登录即表示同意<a>隐私政策</a>
        </div>
      </div>
    </Modal>
  )
}
export default Login
