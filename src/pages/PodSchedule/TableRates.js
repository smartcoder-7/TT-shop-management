import React, { useState } from 'react'
import RateLabel from 'components/RateLabel'
import styles from './styles.scss'
import modalContainer from '../../containers/modalContainer';

const TableRates = ({ location }) => {
  const rates = [
    location.defaultRate,
    ...location.specialRates
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
            <br />

            {rates.map((rate, i) => {
              return (
                <div key={i} className={styles.tableRate}>
                  <RateLabel rate={rate} showEmpty />
                  <div>${rate.NON_MEMBER / 2}</div>
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
