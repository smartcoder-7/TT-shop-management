import React, { useState } from 'react'
import Field from './Field'

const PasswordField = ({ name = 'password', label, ...rest }) => {
  return (
    <Field
      type="password"
      label="Password"
      name={name}
      {...rest}
    />
  )
}

export default PasswordField
