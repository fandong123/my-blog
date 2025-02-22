import { useEffect, useRef } from 'react'
import { observer } from 'mobx-react-lite'
import { Form, Input, Button, message } from 'antd'
import requetInstance from 'service/fetch'
import styles from './index.module.scss'
import { useRouter } from 'next/router'

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 },
}

const tailLayout = {
  wrapperCol: { offset: 4 },
}

const UserProfile = () => {
  const [form] = Form.useForm()
  const userInfoRef = useRef<any>(null)
  const { push } = useRouter()

  useEffect(() => {
    requetInstance.get('/api/user/detail').then((res: any) => {
      if (res?.code === 0) {
        form.setFieldsValue(res?.data)
        userInfoRef.current = res?.data
      } else {
        message.error(res?.msg || '获取个人信息失败')
      }
    })
  }, [form])

  const handleSubmit = (values: any) => {
    requetInstance.post('/api/user/update', { ...values }).then((res: any) => {
      if (res?.code === 0) {
        message.success(res?.msg || '修改成功')
        push(`/user/${userInfoRef.current?.id}`)
      } else {
        message.error(res?.msg || '修改失败')
      }
    })
  }

  return (
    <div className="content-layout">
      <div className={styles.userProfile}>
        <h2>个人资料</h2>
        <div>
          <Form
            {...layout}
            form={form}
            className={styles.form}
            onFinish={handleSubmit}
          >
            <Form.Item label="用户名" name="nickname">
              <Input placeholder="请输入用户名" />
            </Form.Item>
            <Form.Item label="职位" name="job">
              <Input placeholder="请输入职位" />
            </Form.Item>
            <Form.Item label="个人介绍" name="introduce">
              <Input placeholder="请输入个人介绍" />
            </Form.Item>
            <Form.Item {...tailLayout}>
              <Button type="primary" htmlType="submit">
                保存修改
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default observer(UserProfile)
