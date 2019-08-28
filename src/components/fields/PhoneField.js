import React from 'react'
import { Field } from 'react-final-form'

const PhoneField = ({ name = 'phone', label, ...rest }) => {
  return (
    <Field
      name={name}
      render={({ input, meta }) => (
        <div>
          <input {...input} type="tel" placeholder={label} {...rest} />
          {meta.touched && meta.error && <span>{meta.error}</span>}
        </div>
      )}
    />
  )
}

export default PhoneField