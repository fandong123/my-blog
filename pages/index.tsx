import type { NextPage } from 'next'
import { prepareConnection } from 'db'
import { Article } from 'db/entity'
import { IArticle } from 'pages/api/index'
import ListItem from 'components/ListItem'
import { Divider } from 'antd'
import { Fragment } from 'react'
import { observer } from 'mobx-react-lite'

interface IHomeProps {
  articles: IArticle[]
}

export async function getServerSideProps() {
  const db = await prepareConnection()
  const articles = await db.getRepository(Article).find({
    relations: ['user'],
  })
  console.log('articles:', JSON.parse(JSON.stringify(articles)))
  return { props: { articles: JSON.parse(JSON.stringify(articles)) } }
}

const Home: NextPage<IHomeProps> = (props) => {
  const { articles } = props
  console.log('articles:', articles)
  return (
    <div className="content-layout">
      {articles.map((article) => {
        return (
          <Fragment key={article.id}>
            <ListItem key={article.id} article={article} />
            <Divider />
          </Fragment>
        )
      })}
    </div>
  )
}

export default observer(Home)
