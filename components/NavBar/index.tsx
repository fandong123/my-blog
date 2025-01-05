import type { NextPage } from 'next'
import { observer } from 'mobx-react-lite'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { navs } from './config'
import styles from './index.module.scss'
import { Avatar, Button, Dropdown, Menu, message } from 'antd'
import { useState } from 'react'
import Login from '../Login'
import { useStore } from 'store'
import { HomeOutlined, LoginOutlined } from '@ant-design/icons'
import requetInstance from 'service/fetch'

const NavBar: NextPage = () => {
  const { pathname, push } = useRouter()
  const [isShowLogin, setIsShowLogin] = useState(false)
  const store = useStore()
  const { userId, avatar } = store.user.userInfo

  const handleGotoEditorPage = () => {
    if (userId) {
      push('/editor/new')
    } else {
      message.error('请先登录')
    }
  }
  const handleLogin = () => {
    setIsShowLogin(true)
  }
  const handleClose = () => {
    setIsShowLogin(false)
  }

  const handleGotoPersonalPage = () => {}

  const handleLogout = async () => {
    const res: any = await requetInstance.post('/api/user/logout')
    if (res?.code === 0) {
      store.user.setUserInfo({})
    }
  }

  const renderDropDownMenu = () => {
    return (
      <Menu>
        <Menu.Item key="1" onClick={handleGotoPersonalPage}>
          <HomeOutlined />
          &nbsp; 个人主页
        </Menu.Item>
        <Menu.Item key="2" onClick={handleLogout}>
          <LoginOutlined />
          &nbsp; 退出系统
        </Menu.Item>
      </Menu>
    )
  }

  return (
    <div className={styles.navbar}>
      <section className={styles.logoArea}>BLOG-科长牛B</section>
      <section className={styles.linkArea}>
        {navs.map((nav) => (
          <Link key={nav.value} href={nav.value}>
            <a className={pathname === nav.value ? styles.active : ''}>
              {nav.label}
            </a>
          </Link>
        ))}
      </section>
      <section className={styles.operationArea}>
        <Button onClick={handleGotoEditorPage}>写文章</Button>
        {userId ? (
          <>
            <Dropdown overlay={renderDropDownMenu()} placement="bottomLeft">
              <Avatar src={avatar} size={32} />
            </Dropdown>
          </>
        ) : (
          <Button type="primary" onClick={handleLogin}>
            登录
          </Button>
        )}
      </section>
      <Login isShow={isShowLogin} onClose={handleClose} />
    </div>
  )
}

export default observer(NavBar)
