import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { Button, Input, message, Select } from 'antd'
import { observer } from 'mobx-react-lite'
import { useRouter } from 'next/router'
import requestInstance from 'service/fetch'
import { prepareConnection } from 'db/index'
import { Article } from 'db/entity'
import { IArticle } from 'pages/api'
import '@uiw/react-md-editor/markdown-editor.css'
import '@uiw/react-markdown-preview/markdown.css'
import styles from './index.module.scss'
import requetInstance from 'service/fetch'

interface IUpdateEditorProps {
  article: IArticle
}

export async function getServerSideProps({ params }: any) {
  const db = await prepareConnection()
  const articleRepo = db.getRepository(Article)
  const article = await articleRepo.findOne({
    where: {
      id: params?.id,
    },
    relations: ['user', 'tags'],
  })
  return { props: { article: JSON.parse(JSON.stringify(article)) } }
}

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false })

const UpdateEditor = ({ article }: IUpdateEditorProps) => {
  const { push } = useRouter()
  // const store = useStore()
  const [allTags, setAllTags] = useState<{ id: number; title: string }[]>([])
  const [tagIds, setTagIds] = useState<number[]>(
    article?.tags?.map((tag) => tag.id) || []
  )
  const [title, setTitle] = useState(article?.title || '')
  const [content, setContent] = useState(article?.content || '')
  const handleUpdatePublish = async () => {
    if (!title) {
      message.error('请输入标题')
      return
    }
    const res: any = await requestInstance.post('/api/article/update', {
      title,
      content,
      tagIds,
      id: article?.id,
    })
    if (res?.code === 0) {
      message.success('更新发布成功')
      push(`/article/${article?.id}`)
    } else {
      message.error(res?.msg || '发布失败')
    }
  }
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
  }
  const getTagsAndFollowCounts = async () => {
    const res: any = await requetInstance.post('api/tag/get')
    if (res.code === 0) {
      const { allTags = [] } = res.data || {}
      setAllTags(allTags)
    } else {
      message.error(res.msg || '获取标签列表失败')
    }
  }

  useEffect(() => {
    getTagsAndFollowCounts()
  }, [])
  return (
    <div className={styles.container}>
      <div className={styles.head}>
        <Input
          placeholder="请输入标题"
          value={title}
          onChange={handleTitleChange}
        />
        <Select
          style={{ width: '20%' }}
          options={allTags?.map((tag) => {
            return {
              label: tag.title,
              value: tag.id,
            }
          })}
          mode="multiple"
          value={tagIds}
          onChange={(value) => {
            setTagIds(value)
          }}
        />
        <Button type="primary" onClick={handleUpdatePublish}>
          更新发布
        </Button>
      </div>
      <MDEditor value={content} onChange={(value) => setContent(value || '')} />
    </div>
  )
}

(UpdateEditor as any).layout = null

export default observer(UpdateEditor)
