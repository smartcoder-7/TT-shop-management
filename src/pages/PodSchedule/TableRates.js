import React, { useState } from 'react'
import Modal from 'components/Modal'
import { RateLabel } from 'components/Session'
import RATES from 'util/sessionRates'
import styles from './styles.scss'

const TableRates = () => {
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <Modal isActive={showModal} onClose={() => setShowModal(false)}>
        <div data-row>
          <div data-col="1" />
          <div data-col="10">
            <h3>Table Rates</h3>
            <p data-p2>(price per 30-minute session)</p>
            <br />
            <br />

            {Object.values(RATES).map((rate, i) => {
              return (
                <div key={i} className={styles.tableRate}>
                  <RateLabel rate={rate} showEmpty />
                  <div>${rate.price.NON_MEMBER / 2}</div>
                </div>
              )
            })}
          </div>
        </div>
        <div data-col="1" />
      </Modal>
      <button className={styles.tableRates} data-link onClick={() => setShowModal(true)}>
        Table Rates
      </button>
    </>
  )
}

export default TableRates