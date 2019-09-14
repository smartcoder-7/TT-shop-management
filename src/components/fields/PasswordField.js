import React from 'react'
import { Field } from 'react-final-form'
import FieldWrapper from './FieldWrapper'

const PasswordField = ({ name = 'password', label, ...rest }) => {
  return (
    <Field
      name={name}
      render={({ input, meta }) => (
        <FieldWrapper isEmpty={!input.value} label={label}>
          <input {...input} type="password" {...rest} />
          {meta.touched && meta.error && <span>{meta.error}</span>}
        </FieldWrapper>
      )}
    />
  )
}

export default PasswordField