import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import classnames from 'classnames'

import styles from './styles.scss'
import Menu from './Menu'
import Logo from '../Logo'
import Modal from 'components/Modal'
import modalContainer, { ModalSubscriber } from 'containers/modalContainer';
import contextContainer from 'containers/contextContainer'

const IS_DEV = process.env.NODE_ENV === 'development'

const Layout = ({
  className,
  children
}) => {
  const isTesting = IS_DEV || contextContainer.isMobile
  const [scrolled, setScrolled] = useState(!!window.pageYOffset)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(!!window.pageYOffset)
    }

    window.addEventListener('scroll', onScroll)

    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  })

  return (
    <div className={classnames(styles.layout, className)}>
      <div className={styles.headerWrapper} data-bg-color data-scrolled={scrolled}>
        <header data-row="full">
          <div className={styles.headerContent} data-col="12">
            {isTesting && <Menu />}

            <ul>
              <li>
                <Link to="/">
                  <Logo className={styles.logo} />
                </Link>
              </li>
            </ul>
          </div>
        </header>
      </div>

      <main>
        {children}
      </main>

      <ModalSubscriber>{() => {
        const { content, isOpen } = modalContainer

        return (
          <Modal isActive={isOpen}>
            {content}
          </Modal>
        )
      }}</ModalSubscriber>
    </div>
  )
}

export default Layout
