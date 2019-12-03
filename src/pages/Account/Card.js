import React from 'react'
import visaSvg from 'payment-icons/min/flat/visa.svg'
import mastercardSvg from 'payment-icons/min/flat/mastercard.svg'

import styles from './styles.scss'

const ICONS = {
  Visa: visaSvg,
  MasterCard: mastercardSvg,
}

const Card = ({
  brand,
  last4 = '••••',
  isActive,
  onClick
}) => (
    <div className={styles.card} onClick={onClick} data-is-active={isActive}>
      {last4 && (
        <span data-label className={styles.cardNumber}>
          {last4}
        </span>
      )}

      {ICONS[brand] && (
        <span
          className={styles.cardBrand}
          data-type={brand.toUpperCase()}
          dangerouslySetInnerHTML={{ __html: ICONS[brand] }}
        />
      )}

      {!ICONS[brand] && (
        <span className={styles.cardBrand} data-type="DEFAULT" />
      )}
    </div>
  )

export default Card