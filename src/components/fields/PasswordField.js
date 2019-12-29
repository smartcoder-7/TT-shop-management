import React from 'react'
import Field from './Field'

const PasswordField = ({ name = 'password', label, ...rest }) => {
  return (
    <Field
      type="password"
      label={label}
      name={name}
      {...rest}
    />
  )
}

export default PasswordField
