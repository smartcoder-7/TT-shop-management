import React, { useState } from 'react'
import styles from '../styles.scss'
import { createPurchase } from 'api'
import locations from '../../../../locations'

const DEFAULT_LOCATION_ID = '40-allen'

const ChargeUser = ({
  user = {},
  onCharge = () => { }
}) => {
  const [locationId, setLocationId] = useState(DEFAULT_LOCATION_ID)
  const [chargeAmount, setChargeAmount] = useState(5)
  const [chargeSuccess, setChargeSuccess] = useState()

  const updateChargeAmount = (e) => {
    let val = parseFloat(e.target.value)
    if (Number.isNaN(val)) val = 0
    if (val > 100) val = 100
    if (val < 0) val = 0
    setChargeAmount(val)
  }

  const chargeUser = () => {
    createPurchase({
      userId: user.id,
      locationId: locationId,
      purchase: { customAmount: chargeAmount * 100, customDescription: 'PINGPOD: Miscellaneous Purchase' }
    }).then(() => {
      setChargeSuccess(true)
      onCharge()

      setTimeout(() => {
        setChargeSuccess(false)
      }, 5000)
    })
  }

  return (
    <div className={styles.chargeUser}>
      {chargeSuccess && `Successfully charged user $${chargeAmount.toFixed(2)}.`}
      {!chargeSuccess && (
        <>
          <input type='number' min={1} max={100} value={chargeAmount} onChange={updateChargeAmount} />
          <button onClick={chargeUser}>Charge User ${chargeAmount.toFixed(2)}</button>
          <select defaultValue={DEFAULT_LOCATION_ID} onChange={setLocationId}>
            {Object.values(locations).map((location) => (
              <option value={location.id} key={location.id}>{location.displayName}</option>
            ))}
          </select>
        </>
      )}
    </div>
  )
}

export default ChargeUser
