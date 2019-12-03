import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import Layout from 'components/Layout'
import locations from '../../../locations.json'

import styles from './styles.scss'
import cartContainer from 'containers/cartContainer.js';


const LocationPicker = ({ history }) => {
  const pickLocation = (locationId) => {
    cartContainer.setLocationId(locationId)
    history.push(`/reserve/${locationId}`)
  }

  return (
    <Layout className={styles.account}>
      <div data-row className={styles.details}>
        <div data-col={12}>
          <h1>Choose a Location</h1>

          <div className={styles.locations}>
            {Object.keys(locations).map(key => {
              const location = locations[key]

              return (
                <button data-plain key={key} onClick={() => pickLocation(key)}>
                  <div className={styles.location}>
                    <h2>{location.displayName}</h2>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default withRouter(LocationPicker)
