import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import Layout from 'components/Layout'
import locations from '../../../locations'

import styles from './styles.scss'
import cartContainer from 'containers/cartContainer.js';
import authContainer from '../../containers/authContainer';

const LocationPicker = ({ history }) => {
  return (
    <Layout className={styles.locationPicker}>
      <div data-row className={styles.details}>
        <div data-col={12}>
          <h1>Choose a Location</h1>

          <div className={styles.locations}>
            {Object.keys(locations).map(key => {
              const location = locations[key]

              const pickLocation = (locationId) => {
                cartContainer.setLocationId(locationId)
                history.push(`/reserve/${locationId}`)
              }

              const disabled = process.env.NODE_ENV === 'production' && !location.active

              return (
                <button data-plain key={key} onClick={() => pickLocation(key)} disabled={disabled}>
                  <div className={styles.location} data-active={location.active}>
                    <h2>
                      {location.displayName}
                      {location.inBeta && <label>(In Testing)</label>}
                      {!location.active && <label>(Coming Soon)</label>}
                    </h2>
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
