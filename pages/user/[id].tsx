import { prepareConnection } from 'db'
import { Article, User } from 'db/entity'
import type { NextPage } from 'next'
import { Button, Avatar, Divider } from 'antd'
import { CodeOutlined, FireOutlined, FundViewOutlined } from '@ant-design/icons'
import styles from './index.module.scss'
import Link from 'next/link'
import ListItem from 'components/ListItem'
import { IArticle } from 'pages/api'

export async function getServerSideProps({ params }: any) {
  const db = await prepareConnection()
  const userRepo = db.getRepository(User)
  const articleRepo = db.getRepository(Article)
  const userInfo = await userRepo.findOne({
    where: {
      id: Number(params?.id),
    },
  })
  const articles = await articleRepo.find({
    relations: ['user', 'tags'],
    where: {
      user: {
        id: Number(params?.id),
      },
    },
  })

  return {
    props: {
      userInfo: JSON.parse(JSON.stringify(userInfo || {})),
      articles: JSON.parse(JSON.stringify(articles || {})),
    },
  }
}

const Index: NextPage<{ userInfo: any; articles: IArticle[] }> = (props) => {
  const { userInfo = {}, articles = [] } = props
  const viewsCount = articles?.reduce((pre, cur) => {
    pre += cur?.views
    return pre
  }, 0)
  return (
    <div className={styles.userDetail}>
      <div className={styles.left}>
        <div className={styles.userInfo}>
          <Avatar className={styles.avatar} src={userInfo?.avatar} size={90} />
          <div>
            <div className={styles.nickname}>{userInfo?.nickname}</div>
            <div className={styles.desc}>
              <CodeOutlined /> {userInfo?.job}
            </div>
            <div className={styles.desc}>
              <FireOutlined /> {userInfo?.introduce}
            </div>
          </div>
          <Link href="/user/profile">
            <Button>编辑个人资料</Button>
          </Link>
        </div>
        <Divider />
        <div className={styles.article}>
          {articles?.map((article: any) => (
            <div key={article?.id}>
              <ListItem article={article} />
              <Divider />
            </div>
          ))}
        </div>
      </div>
      <div className={styles.right}>
        <div className={styles.achievement}>
          <div className={styles.header}>个人成就</div>
          <div className={styles.number}>
            <div className={styles.wrapper}>
              <FundViewOutlined />
              <span>共创作 {articles?.length} 篇文章</span>
            </div>
            <div className={styles.wrapper}>
              <FundViewOutlined />
              <span>文章被阅读 {viewsCount} 次</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Index
