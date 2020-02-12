import React from 'react'
import visaSvg from 'payment-icons/min/flat/visa.svg'
import defaultSvg from 'payment-icons/min/flat/default.svg'
import mastercardSvg from 'payment-icons/min/flat/mastercard.svg'
import amexSvg from 'payment-icons/min/flat/amex.svg'
import discoverSvg from 'payment-icons/min/flat/discover.svg'
import dinersSvg from 'payment-icons/min/flat/diners.svg'
import unionpaySvg from 'payment-icons/min/flat/unionpay.svg'

import styles from './styles.scss'

const ICONS = {
  Visa: visaSvg,
  MasterCard: mastercardSvg,
  'American Express': amexSvg,
  'Diners Club': dinersSvg,
  'Discover': discoverSvg,
  'UnionPay': unionpaySvg,
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
          dangerouslySetInnerHTML={{ __html: ICONS[brand] || defaultSvg }}
        />
      )}

      {!ICONS[brand] && (
        <span className={styles.cardBrand} data-type="DEFAULT" />
      )}
    </div>
  )

export default Card