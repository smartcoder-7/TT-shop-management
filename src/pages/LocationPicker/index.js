import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import Layout from 'components/Layout'
import locations from '../../../locations'

import styles from './styles.scss'
import cartContainer from 'containers/cartContainer.js';
import authContainer from '../../containers/authContainer';


const LocationPicker = ({ history }) => {
  return (
    <Layout className={styles.account}>
      <div data-row className={styles.details}>
        <div data-col={12}>
          <h1>Choose a Location</h1>

          <div className={styles.locations}>
            {Object.keys(locations).map(key => {
              const location = locations[key]

              const hasPermission = location.memberOnly ?
                authContainer.user.isMember : true

              const pickLocation = (locationId) => {
                if (!hasPermission) {
                  history.push(`/login?redirect=/reserve/${locationId}`)
                  return
                }

                cartContainer.setLocationId(locationId)
                history.push(`/reserve/${locationId}`)
              }

              const disabled = !location.active

              return (
                <button data-plain key={key} onClick={() => pickLocation(key)} disabled={disabled}>
                  <div className={styles.location} data-active={location.active}>
                    <h2>
                      {location.displayName}
                      {location.memberOnly && <label>(Members Only)</label>}
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
