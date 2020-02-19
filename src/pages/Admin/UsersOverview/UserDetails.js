import React, { useState } from 'react'
import styles from '../styles.scss'
import modalContainer from 'containers/modalContainer'
import OpenStore from 'components/modalActions/OpenStore'
import authContainer from 'containers/authContainer'
import { parseTime } from 'shared/datetime'
import Details from '../Details'
import ChargeUser from './ChargeUser'
import ProductPicker from 'components/ProductPicker'
import { cancelReservations, updateUserInfo, createPurchase } from 'api'
import useUsers from '../useUsers';

const UserDetails = ({
  user = {},
}) => {
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
          {hasActiveCard && user.stripeId && (
            <ChargeUser user={user} onCharge={updateUsers} />
          )}
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
        <OpenStore userId={user.id}>{({ open }) => {
          const openCharger = (e) => {
            e.stopPropagation()
            open()
          }

          return (
            <td className={styles.createPurchase} data-label onClick={openCharger}>
              + Shop
            </td>
          )
        }}</OpenStore>
      </tr>
    )}</Details>
  )
}

export default UserDetails
