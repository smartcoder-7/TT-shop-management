import React, { useState } from 'react'
import styles from './styles.scss'
import modalContainer from 'containers/modalContainer';

const Detail = ({ href, label, content = '' }) => {
  const inner = (<>
    <label>{label}</label>
    {content}
  </>)

  return (
    <p data-p3 className={styles.detail}>
      {href && <a data-link href={href} target="_blank" rel="noopener noreferrer">
        {inner}
      </a>}
      {!href && inner}
    </p>
  )
}

const ModalDetails = ({
  children,
  title,
  details = [],
}) => {
  const [isOpen, setOpen] = useState(false)
  const content = (
    <div className={styles.detailsWrapper}>
      <h3>{title}</h3>
      <br />
      <div className={styles.details}>
        {details.map(({ label, href, onClick, content }, i) => (
          <Detail key={i} label={label} href={href} onClick={onClick} content={content} />
        ))}
      </div>
    </div>
  )

  if (isOpen) {
    modalContainer.setContent({ content })
  }

  const openModal = async () => {
    setOpen(true)
    modalContainer.open({ content, onClose: () => setOpen(false) })
  }

  return children({ openModal })
}

export default ModalDetails
