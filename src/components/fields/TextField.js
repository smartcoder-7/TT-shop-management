import React from 'react'
import { Field } from 'react-final-form'

const TextField = ({ name = 'text', label, initialValue, ...rest }) => {
  return (
    <Field
      name={name}
      initialValue={initialValue}
      render={({ input, meta }) => (
        <div>
          <input {...input} type="text" placeholder={label} {...rest} />
          {meta.touched && meta.error && <span>{meta.error}</span>}
        </div>
      )}
    />
  )
}

export default TextField