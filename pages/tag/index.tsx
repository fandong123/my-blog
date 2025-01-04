import type { NextPage } from 'next'
import React, { useState, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { useStore } from 'store'
import { Button, message, Tabs } from 'antd'
import * as ANTD_ICONS from '@ant-design/icons'
import requetInstance from 'service/fetch'
import styles from './index.module.scss'

interface User {
  id: number
  nickname: string
}

export interface TagProps {
  id: number
  title: string
  icon: string
  follow_count: number
  article_count: number
  users: User[]
}
// <AlipayOutlined /> <GoogleOutlined />
const { TabPane } = Tabs

const Tag: NextPage<TagProps> = () => {
  // const router = useRouter()
  const store = useStore()
  const { userId } = store.user.userInfo
  const [followTags, setFollowTags] = useState<TagProps[]>([])
  const [allTags, setAllTags] = useState<TagProps[]>([])

  const getTagsAndFollowCounts = async () => {
    const res: any = await requetInstance.post('api/tag/get')
    if (res.code === 0) {
      const { allTags = [], followTags = [] } = res.data || {}
      setAllTags(allTags)
      setFollowTags(followTags)
    } else {
      message.error(res.msg || '获取标签列表失败')
    }
  }

  const handleFollow = async (tagId: number) => {
    const res: any = await requetInstance.post('api/tag/follow', {
      type: 'follow',
      tagId,
    })
    if (res.code === 0) {
      message.success('关注成功')
      getTagsAndFollowCounts()
    } else {
      message.error(res.msg || '关注失败')
    }
  }
  const handleUnFollow = async (tagId: number) => {
    const res: any = await requetInstance.post('api/tag/follow', {
      type: 'unfollow',
      tagId,
    })
    if (res.code === 0) {
      message.success('取消关注成功')
      getTagsAndFollowCounts()
    } else {
      message.error(res.msg || '取消关注失败')
    }
  }

  useEffect(() => {
    getTagsAndFollowCounts()
  }, [])

  return (
    <div className="content-layout">
      <Tabs defaultActiveKey="all">
        <TabPane tab="已关注标签" key="follow" className={styles.tags}>
          {followTags?.map((tag) => (
            <div key={tag?.title} className={styles.tagWrapper}>
              <div>{(ANTD_ICONS as any)[tag?.icon]?.render()}</div>
              <div className={styles.title}>{tag?.title}</div>
              <div>
                {tag?.follow_count} 关注 {tag?.article_count} 文章
              </div>
              {tag?.users?.find(
                (user) => Number(user?.id) === Number(userId)
              ) ? (
                <Button type="primary" onClick={() => handleUnFollow(tag?.id)}>
                  已关注
                </Button>
              ) : (
                <Button onClick={() => handleFollow(tag?.id)}>关注</Button>
              )}
            </div>
          ))}
        </TabPane>
        <TabPane tab="全部标签" key="all" className={styles.tags}>
          {allTags?.map((tag) => (
            <div key={tag?.title} className={styles.tagWrapper}>
              <div>{(ANTD_ICONS as any)[tag?.icon]?.render()}</div>
              <div className={styles.title}>{tag?.title}</div>
              <div>
                {tag?.follow_count} 关注 {tag?.article_count} 文章
              </div>
              {tag?.users?.find(
                (user) => Number(user?.id) === Number(userId)
              ) ? (
                <Button type="primary" onClick={() => handleUnFollow(tag?.id)}>
                  已关注
                </Button>
              ) : (
                <Button onClick={() => handleFollow(tag?.id)}>关注</Button>
              )}
            </div>
          ))}
        </TabPane>
      </Tabs>
    </div>
  )
}

export default observer(Tag)
