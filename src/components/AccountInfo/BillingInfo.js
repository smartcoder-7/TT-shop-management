import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Layout from 'components/Layout'
import firebase from 'util/firebase'

import styles from './styles.scss'
import authContainer, { AuthSubscriber } from 'containers/authContainer'
import Loading from 'components/Loading'
import { INTERVAL_MS } from 'util/getPodSessions'
import getDateParts from 'shared/getDateParts'
import { NewCard, Card } from './Card'
import { updateUser } from 'util/db'
import FieldWrapper from 'components/fields/FieldWrapper'

const functions = firebase.functions()
const getCustomer = functions.httpsCallable('getCustomer')

class BillingInfo extends React.Component {
  state = {
    loading: true,
    squareId: undefined,
    cards: []
  }

  constructor(props) {
    super(props)

    authContainer.subscribe(this.onAuthChange)
  }

  componentDidMount() {
    this.onAuthChange()
  }

  componentWillUnmount() {
    this.isUnmounted = true
    authContainer.unsubscribe(this.onAuthChange)
  }

  componentDidUpdate(prevProps, prevState) {
    const { squareId } = this.state
    if (prevState.squareId === squareId) return

    this.onCardUpdate()
  }

  onAuthChange = () => {
    const { user } = authContainer

    if (!user || !user.squareId) return

    this.setState({ squareId: user.squareId })
  }

  onCardUpdate = () => {
    const { user, userId } = authContainer
    const { squareId } = this.state
    
    getCustomer({ customer_id: squareId })
    .then(({ data })=> {
      if (this.isUnmounted) return

      const cards = data.customer.cards || []

      if (!user.activeCard && cards.length > 0) {
        updateUser(userId, { activeCard: cards[0].id })
      }

      this.setState({ cards, loading: false })
    })
  }

  setActiveCard = (cardId) => {
    const { userId } = authContainer
    updateUser(userId, { activeCard: cardId })
  }

  render() {
    const { loading, cards } = this.state
    const { user } = authContainer

    return (
      <div className={styles.billingInfo}>
        <FieldWrapper label="Billing Info">
          <div className={styles.cards}>
            <Loading loading={loading} />
            {!loading && !cards.length && 'No cards saved.'}

            {cards.map(card => {
              return (
                <Card 
                  {...card} 
                  key={card.id} 
                  onClick={() => this.setActiveCard(card.id)} 
                  isActive={card.id === user.activeCard}
                />
              )
            })}
            
            {!loading && <NewCard onAdd={this.onCardUpdate} />}
          </div>
        </FieldWrapper>
      </div>
    )
  }
}

export default BillingInfo