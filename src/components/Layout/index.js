import React, { useState, useEffect } from 'react'
import { Link, withRouter } from 'react-router-dom'
import classnames from 'classnames'

import styles from './styles.scss'
import Menu from './Menu'
import Logo from '../Logo'
import Modal from 'components/Modal'
import modalContainer, { ModalSubscriber } from 'containers/modalContainer';

const Layout = ({
  className,
  children,
}) => {
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
        <div className={styles.headerBanner}>
          PingPod is currently in alpha testing - please contact info@pingpod.com prior to booking.
          </div>
        <header data-row="full">
          <div className={styles.headerContent} data-col="12">
            <ul>
              <li>
                <Link to="/">
                  <Logo className={styles.logo} />
                </Link>
              </li>
              <li><Link to="/sign-up" data-label>Create an Account</Link></li>
            </ul>

            <Menu />
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

export default withRouter(Layout)
