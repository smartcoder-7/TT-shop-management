import React from 'react'
import { withRouter, Link } from 'react-router-dom'

import cartContainer from 'containers/cartContainer'
import Layout from 'components/Layout'
import Sessions from 'components/Sessions'
import { formatDate } from 'util/getPodSessions'

import styles from './styles.scss'

class PodSchedule extends React.Component {
  state = {
    date: new Date(),
    sessions: []
  }

  constructor(props) {
    super(props)
  }

  render() {
    const { date } = this.state
    const { params } = this.props.match
    const locationId = params.locationId
    
    return (
      <Layout className={styles.transactionFeed}>
        <h1>Pod Schedule</h1>
        <h2>Choose times</h2>

        <div>
          <Sessions date={formatDate(date)} locationId={locationId}>{(sessions) => {
            return sessions.map(({ id, isAvailable }) => (
              <div 
                className={styles.session} 
                key={id} 
                onClick={() => cartContainer.addItem(id)}
              >
                {id}
                {!isAvailable && <h4>UNAVAILABLE</h4>} 
              </div>
            ))
          }}</Sessions>
        </div>

        <Link to="/cart">
          <button>
            Checkout
          </button>
        </Link>
      </Layout>
    )
  }
}

export default withRouter(PodSchedule)