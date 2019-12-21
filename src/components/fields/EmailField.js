import React, { useEffect, useRef } from 'react'
import Field from './Field'

const EmailField = ({ name = 'email', label, autoComplete, ...rest }) => {
  return (
    <Field
      type="email"
      label="Email Address"
      name={name}
      {...rest}
    />
  )
}

export default EmailField
