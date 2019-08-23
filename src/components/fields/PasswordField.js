import React from 'react'
import { Field } from 'react-final-form'

const PasswordField = ({ name = 'password', label, ...rest }) => {
  return (
    <Field
      name={name}
      render={({ input, meta }) => (
        <div>
          <input {...input} type="password" placeholder={label} {...rest} />
          {meta.touched && meta.error && <span>{meta.error}</span>}
        </div>
      )}
    />
  )
}

export default PasswordField