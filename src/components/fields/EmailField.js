import React from 'react'
import { Field } from 'react-final-form'

const EmailField = ({ name = 'email', label, ...rest }) => {
  return (
    <Field
      name={name}
      render={({ input, meta }) => (
        <div>
          <input {...input} type="email" placeholder={label} {...rest} />
          {meta.touched && meta.error && <span>{meta.error}</span>}
        </div>
      )}
    />
  )
}

export default EmailField