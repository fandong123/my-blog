import React, { useState } from 'react'
import dynamic from 'next/dynamic'
import { Button, Input, message } from 'antd'
import { observer } from 'mobx-react-lite'
import { useStore } from 'store'
import { useRouter } from 'next/router'
import requestInstance from 'service/fetch'
import '@uiw/react-md-editor/markdown-editor.css'
import '@uiw/react-markdown-preview/markdown.css'
import styles from './index.module.scss'

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false })

const NewEditor = () => {
  const { push } = useRouter()
  const store = useStore()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const handlePublish = async () => {
    if (!title) {
      message.error('请输入标题')
      return
    }
    const res: any = await requestInstance.post('/api/article/publish', {
      title,
      content,
    })
    if (res?.code === 0) {
      const id = store?.user?.userInfo?.userId
      if (store.user.userInfo.userId) {
        message.success('发布成功')
        push(`/user/${id}`)
        return
      }
      push(`/`)
    } else {
      message.error(res?.msg || '发布失败')
    }
  }
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
  }
  return (
    <div className={styles.container}>
      <div className={styles.head}>
        <Input
          placeholder="请输入标题"
          value={title}
          onChange={handleTitleChange}
        />
        <Button type="primary" onClick={handlePublish}>
          发布
        </Button>
      </div>
      <MDEditor value={content} onChange={(value) => setContent(value || '')} />
    </div>
  )
}

NewEditor.layout = null

export default observer(NewEditor)
