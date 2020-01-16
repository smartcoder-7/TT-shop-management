import React, { useState } from 'react'
import RateLabel from 'components/RateLabel'
import styles from './styles.scss'
import modalContainer from '../../containers/modalContainer';

const TableRates = ({ location }) => {
  const rates = [
    location.defaultRate,
    ...(location.specialRates || [])
  ]

  const openModal = () => {
    modalContainer.open({
      content: (
        <div data-row>
          <div data-col="1" />
          <div data-col="10">
            <h3>Table Rates</h3>
            <p data-p2>(price per 30-minute session)</p>
            <br />

            {rates.map((rate, i) => {
              return (
                <div className={styles.rateGroup}>
                  {rate.displayName && <h3>{rate.displayName}</h3>}

                  <div key={i} className={styles.rate}>
                    <label>Member</label>
                    <div>${rate.MEMBER / 2}</div>
                  </div>

                  {rate.NON_MEMBER && <div key={i} className={styles.rate}>
                    <label>Non-Member</label>
                    <div>${rate.NON_MEMBER / 2}</div>
                  </div>}
                </div>
              )
            })}
          </div>
          <div data-col="1" />
        </div>
      )
    })
  }

  return (
    <>
      <button className={styles.tableRates} data-link onClick={openModal}>
        Table Rates
      </button>
    </>
  )
}

export default TableRates
