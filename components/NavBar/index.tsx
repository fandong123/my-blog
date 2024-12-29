import type { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { navs } from './config'
import styles from './index.module.scss'

const NavBar: NextPage = () => {
  const { pathname, push } = useRouter()
  console.log(pathname, push)
  return (
    <div className={styles.navbar}>
      <section className={styles.logoArea}>BLOG-C</section>
      <section className={styles.linkArea}>
        {navs.map((nav) => (
          <Link key={nav.value} href={nav.value}>
            <a className={pathname === nav.value ? styles.active : ''}>
              {nav.label}
            </a>
          </Link>
        ))}
      </section>
    </div>
  )
}

export default NavBar
