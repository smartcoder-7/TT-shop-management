import React from 'react'

import Layout from 'components/Layout'

import styles from './styles.scss'

class PodSchedule extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Layout className={styles.transactionFeed}>
        <h1>Pod Schedule</h1>
        <h2>Choose times</h2>
      </Layout>
    )
  }
}

export default PodSchedule
