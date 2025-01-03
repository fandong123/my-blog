import { NextPage } from 'next'
import Link from 'next/link'
import { Avatar, Button, Divider, Input, message } from 'antd'
import { observer } from 'mobx-react-lite'
import { useStore } from 'store/index'
import MarkDown from 'markdown-to-jsx'
import { format } from 'date-fns'
import { prepareConnection } from 'db/index'
import { Article } from 'db/entity'
import { IArticle } from 'pages/api'
import styles from './index.module.scss'
import { useState } from 'react'
import requetInstance from 'service/fetch'

interface IArticleProps {
  article: IArticle
}

export async function getServerSideProps({ params }: any) {
  const db = await prepareConnection()
  const articleRepo = db.getRepository(Article)
  const article = await articleRepo.findOne({
    where: {
      id: params?.id,
    },
    relations: ['user', 'comments', 'comments.user'],
  })
  console.log('article-start:', article?.views)
  if (article) {
    article.views = article?.views + 1
    await articleRepo.save(article)
    // await articleRepo.update(article.id, {
    //   views: article.views + 1
    // })
  }
  return { props: { article: JSON.parse(JSON.stringify(article)) } }
}

const ArticleDetail: NextPage<IArticleProps> = (props) => {
  const { article } = props
  // const [comments, setComments] = useState(article?.comments || [])
  const [inputVal, setInputVal] = useState('')
  const store = useStore()
  const loginUserInfo = store?.user?.userInfo
  const { user } = article || {}
  const { id, nickname, avatar } = user || {}
  console.log('article:', article)
  const handleComment = async () => {
    if (!inputVal) {
      message.error('请输入评论内容')
      return
    }
    const res: any = await requetInstance.post('/api/comment/publish', {
      content: inputVal,
      article_id: article?.id,
    })
    if (res?.code === 0) {
      message.success('评论成功')
      window.location.reload()
      setInputVal('')
    } else {
      message.error(res?.msg || '评论失败')
    }
  }
  return (
    <div>
      <div className="content-layout">
        <h2 className={styles.title}>{article?.title}</h2>
        <div className={styles.user}>
          <Avatar src={avatar} size={50} />
          <div className={styles.info}>
            <div className={styles.name}>{nickname}</div>
            <div className={styles.date}>
              <div>
                {format(new Date(article?.update_time), 'yyyy-MM-dd hh:mm:ss')}
              </div>
              <div>阅读 {article?.views}</div>
              {Number(loginUserInfo?.userId) === Number(id) && (
                <Link href={`/editor/${article?.id}`}>编辑</Link>
              )}
            </div>
          </div>
        </div>
        <MarkDown className={styles.markdown}>{article?.content}</MarkDown>
      </div>
      <div className={styles.divider}></div>
      <div className="content-layout">
        <div className={styles.comment}>
          <h3>评论</h3>
          {loginUserInfo?.userId && (
            <div className={styles.enter}>
              <Avatar src={avatar} size={40} />
              <div className={styles.content}>
                <Input.TextArea
                  placeholder="请输入评论"
                  rows={4}
                  value={inputVal}
                  onChange={(event) => setInputVal(event?.target?.value)}
                />
                <Button type="primary" onClick={handleComment}>
                  发表评论
                </Button>
              </div>
            </div>
          )}
          <Divider />
          <div className={styles.display}>
            {article?.comments?.map((comment: any) => (
              <div className={styles.wrapper} key={comment?.id}>
                <Avatar src={comment?.user?.avatar} size={40} />
                <div className={styles.info}>
                  <div className={styles.name}>
                    <div>{comment?.user?.nickname}</div>
                    <div className={styles.date}>
                      {format(
                        new Date(comment?.update_time),
                        'yyyy-MM-dd hh:mm:ss'
                      )}
                    </div>
                  </div>
                  <div className={styles.content}>{comment?.content}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default observer(ArticleDetail)
