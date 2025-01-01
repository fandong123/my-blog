import { NextPage } from 'next'
import Link from 'next/link'
import { Avatar } from 'antd'
import { observer } from 'mobx-react-lite'
import { useStore } from 'store/index'
import MarkDown from 'markdown-to-jsx'
import { format } from 'date-fns'
import { prepareConnection } from 'db/index'
import { Article } from 'db/entity'
import { IArticle } from 'pages/api'
import styles from './index.module.scss'

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
    relations: ['user'],
  })
  console.log('article-start:', article?.views)
  if (article) {
    article.views = article?.views + 1
    await articleRepo.save(article)
    // await articleRepo.update(article.id, {
    //   views: article.views + 1
    // })
  }
  console.log('article-end:', article?.views)
  return { props: { article: JSON.parse(JSON.stringify(article)) } }
}

const ArticleDetail: NextPage<IArticleProps> = (props) => {
  const { article } = props
  const store = useStore()
  const loginUserInfo = store?.user?.userInfo
  const { user } = article || {}
  const { id, nickname, avatar } = user || {}
  console.log('article:', article)
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
    </div>
  )
}

export default observer(ArticleDetail)
