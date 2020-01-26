import React, { useState } from 'react'
import styles from './styles.scss'
import modalContainer from 'containers/modalContainer'
import authContainer from 'containers/authContainer'
import { parseTime } from 'shared/datetime'
import Details from './Details'
import { cancelReservations, updateUserInfo, createPurchase } from 'api'
import useUsers from './useUsers';

const UserDetails = ({
  user = {},
}) => {
  const [chargeAmount, setChargeAmount] = useState(5)
  const [chargeSuccess, setChargeSuccess] = useState()
  const { updateUsers } = useUsers()
  const hasActiveCard = !!user.hasActiveCard
  const isMember = !!user.isMember
  const isAdmin = !!user.isAdmin
  let createdAt = ''

  try {
    const { year, monthAbbr } = parseTime(user.createdAt)
    createdAt = `${monthAbbr} ${year}`
  } catch (err) {
    createdAt = '-'
  }

  const isSelf = user.id === authContainer.userId

  const toggleMember = () =>
    updateUserInfo({ userId: user.id, isMember: !user.isMember })
      .then(updateUsers)

  const toggleAdmin = () => {
    if (isSelf) return Promise.resolve()
    return updateUserInfo({ userId: user.id, isAdmin: !user.isAdmin })
      .then(updateUsers)
  }

  const updateChargeAmount = (e) => {
    let val = parseFloat(e.target.value)
    if (Number.isNaN(val)) val = 0
    if (val > 100) val = 100
    if (val < 0) val = 0
    setChargeAmount(val)
  }

  const chargeUser = () => {
    createPurchase({
      userId: user.id,
      locationId: '40-allen',
      purchase: { customAmount: chargeAmount * 100, customDescription: 'PINGPOD: Miscellaneous Purchase' }
    }).then(() => {
      setChargeSuccess(true)
      updateUsers()

      setTimeout(() => {
        setChargeSuccess(false)
      }, 5000)
    })
  }

  const details = [
    {
      label: 'Name',
      content: `${user.firstName} ${user.lastName}`,
    },
    {
      label: 'Email',
      content: user.email,
    },
    {
      label: 'Has Active Card',
      content: (!!user.hasActiveCard).toString(),
    },
    user.stripeId ? {
      label: 'Stripe Customer ID',
      href: `https://dashboard.stripe.com/test/customers/${user.stripeId}`,
      content: user.stripeId,
    } : {},
    {
      label: 'Is Member',
      content: (!!user.isMember).toString(),
    },
    {
      label: 'Is Admin',
      content: (!!user.isAdmin).toString(),
    },
    {
      label: 'Actions',
      content: (
        <>
          <button onClick={toggleMember}>{user.isMember ? 'Remove Membership' : 'Add Membership'}</button>
          {!isSelf && <button onClick={toggleAdmin}>{user.isAdmin ? 'Remove Admin' : 'Make Admin'}</button>}
          {hasActiveCard && user.stripeId && !chargeSuccess && (
            <div className={styles.chargeUser}>
              <input type='number' min={1} max={100} value={chargeAmount} onChange={updateChargeAmount} />
              <button onClick={chargeUser}>Charge User ${chargeAmount.toFixed(2)}</button>
            </div>
          )}
          {chargeSuccess && `Successfully charged user $${chargeAmount.toFixed(2)}.`}
        </>
      )
    }
  ]

  return (
    <Details
      title="User Details"
      details={details}
    >{({ openModal }) => (
      <tr className={styles.user} onClick={openModal}>
        <td className={styles.lastName}>{user.lastName}</td>
        <td className={styles.firstName}>{user.firstName}</td>
        <td className={styles.email}>{user.email}</td>
        <td className={styles.createdAt}>{createdAt}</td>
        <td className={styles.activeCard} data-label data-active={hasActiveCard}>
          {hasActiveCard.toString()}
        </td>
        <td className={styles.activeCard} data-label data-active={isMember}>
          {isMember.toString()}
        </td>
        <td className={styles.activeCard} data-label data-active={isAdmin}>
          {isAdmin.toString()}
        </td>
      </tr>
    )}</Details>
  )
}

export default UserDetails
