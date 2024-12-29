import type { NextPage } from 'next'
import { Form, Modal, Input, Button, message } from 'antd'
import { useState } from 'react'
import CutDown from '../CutDown'
import requestInstance from 'service/fetch'

interface Iprops {
  isShow: boolean;
  onClose: () => void;
}
const Login: NextPage<Iprops> = (props) => {
  const { isShow, onClose } = props
  const [isShowVerifyCode, setIsShowVerifyCode] = useState(false)
  const [form] = Form.useForm()

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
          <Button type="primary" block shape="round">
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
