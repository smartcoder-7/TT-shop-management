import React from 'react'
import { withRouter, Link } from 'react-router-dom'

import cartContainer from 'containers/cartContainer'
import Layout from 'components/Layout'
import Sessions from 'components/Sessions'
import { ScheduleSession } from 'components/Session'
import { formatDate } from 'util/getPodSessions'

import styles from './styles.scss'
import { CartSubscriber } from '../../containers/cartContainer';

const DAYS_OF_THE_WEEK = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
]

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
]

class PodSchedule extends React.Component {
  state = {
    date: new Date(),
    sessions: []
  }

  constructor(props) {
    super(props)
  }

  prevDay = () => {
    const current = this.state.date
    const date = new Date(current)
    date.setDate(date.getDate() - 1)
    this.setState({ date })
  }

  nextDay = () => {
    const current = this.state.date
    const date = new Date(current)
    date.setDate(date.getDate() + 1)
    this.setState({ date })
  }

  render() {
    const { date } = this.state
    const { params } = this.props.match
    const locationId = params.locationId

    const dayOfTheWeek = DAYS_OF_THE_WEEK[date.getDay()]
    const month = MONTHS[date.getMonth()]
    const day = date.getDate()
    
    return (
      <Layout className={styles.podSchedule}>
        <div data-row>
          <div data-col="3" onClick={this.prevDay}>PREV</div>
          <div data-col="6" className={styles.today}>
            <p data-p2>{dayOfTheWeek}</p>
            <h1>{month} {day}</h1>
          </div>
          <div data-col="3" onClick={this.nextDay}>NEXT</div>
        </div>

        <div className={styles.sessions} data-row>
          <CartSubscriber>{() => (
            <Sessions date={formatDate(date)} locationId={locationId}>{(sessions) => (
              sessions.map(({ id, isAvailable }) => {
                const isSelected = cartContainer.isInCart(id)

                const toggleSelect = () => {
                  if (isSelected) cartContainer.removeItem(id)
                  else cartContainer.addItem(id)
                }

                return (
                  <ScheduleSession
                    id={id}
                    isAvailable={isAvailable}
                    isSelected={isSelected}
                    key={id} 
                    onClick={toggleSelect}
                  />
                )
              })
            )}</Sessions>
          )}</CartSubscriber>
        </div>

        <div data-row className={styles.checkout}>
          <Link to="/cart" data-col="12">
            <button>
              Checkout
            </button>
          </Link>
        </div>
      </Layout>
    )
  }
}

export default withRouter(PodSchedule)