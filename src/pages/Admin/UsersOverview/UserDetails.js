import React, { useState } from 'react'
import styles from '../styles.scss'
import modalContainer from 'containers/modalContainer'
import OpenStore from 'components/modalActions/OpenStore'
import authContainer from 'containers/authContainer'
import { parseTime } from 'shared/datetime'
import Details from '../Details'
import ChargeUser from './ChargeUser'
import ProductPicker from 'components/ProductPicker'
import { cancelReservations, updateUser, createPurchase } from 'api'
import useUsers from '../useUsers';

const UserDetails = ({
  user = {},
}) => {
  const { updateUsers } = useUsers()
  const hasActiveCard = !!user.hasActiveCard
  const isMember = !!user.isMember
  const isAdmin = !!user.isAdmin
  const hasBetaAccess = !!user.hasBetaAccess
  let createdAt = ''

  try {
    const { year, monthAbbr } = parseTime(user.createdAt)
    createdAt = `${monthAbbr} ${year}`
  } catch (err) {
    createdAt = '-'
  }

  const isSelf = user.id === authContainer.userId

  const toggleMember = () =>
    updateUser({ id: user.id, isMember: !user.isMember })
      .then(updateUsers)

  const toggleBeta = () =>
    updateUser({ id: user.id, hasBetaAccess: !hasBetaAccess })
      .then(updateUsers)

  const toggleAdmin = () => {
    if (isSelf) return Promise.resolve()
    return updateUser({ id: user.id, isAdmin: !user.isAdmin })
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
      label: 'Has Beta Access',
      content: (hasBetaAccess).toString(),
    },
    {
      label: 'Actions',
      content: (
        <>
          <button onClick={toggleMember}>{user.isMember ? 'Remove Membership' : 'Add Membership'}</button>
          <button onClick={toggleBeta}>{hasBetaAccess ? 'Remove Beta Access' : 'Add Beta Access'}</button>
          {!isSelf && <button onClick={toggleAdmin}>{user.isAdmin ? 'Remove Admin' : 'Make Admin'}</button>}
          {hasActiveCard && user.stripeId && (
            <ChargeUser user={user} onCharge={updateUsers} />
          )}
          <OpenStore userId={user.id}>{({ open }) => {
            const openCharger = (e) => {
              e.stopPropagation()
              open()
            }

            return (
              <button className={styles.createPurchase} onClick={openCharger}>
                Shop
              </button>
            )
          }}</OpenStore>
        </>
      )
    }
  ]

  return (
    <Details
      title="User Details"
      details={details}
    >{({ openModal }) => (
      <button data-link onClick={openModal}>
        View/Edit
      </button>
    )}</Details>
  )
}

export default UserDetails
