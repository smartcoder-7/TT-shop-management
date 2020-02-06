import React, { useState, useEffect } from 'react'
import { Link, withRouter } from 'react-router-dom'

import Layout from 'components/Layout'

import styles from './styles.scss'
import authContainer from '../../containers/authContainer';
import { getInvites, acceptInvites } from '../../api';
import Reservations from '../../components/Reservations';

const Invite = ({ match: { params } }, history) => {
  const [invites, setInvites] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState()
  const tokenId = params.tokenId

  useEffect(() => {
    getInvites({ tokenId })
      .then(({ invites }) => setInvites(invites))
      .catch((err) => {
        console.warn('Could not get invite.', err)
      })
  }, [tokenId])

  useEffect(() => {
    if (!invites.length) return
    acceptInvites({ userId: authContainer.userId, invites: invites.map(i => i.id) })
      .catch((err) => {
        setError(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [invites])

  if (loading) return (
    <Layout className={styles.success} />
  )

  const reservations = invites.map(i => i.reservation)

  return (
    <Layout className={styles.success}>
      <div data-row>
        <div data-col={12} className={styles.summary}>
          {!error && reservations && (
            <>
              <h1>You've been invited!</h1>

              <p data-p3>
                Reservation Info
              </p>

              <br />
              <Reservations reservations={reservations} />
            </>
          )}

          {error && (
            <>
              <h1>You've been invited!</h1>

              <p data-p3>
                {error}
              </p>
            </>
          )}

          <br />

          <Link to="/account">
            <button>
              Go To Your Account
            </button>
          </Link>
        </div>
      </div>
    </Layout>
  )
}

export default withRouter(Invite)
