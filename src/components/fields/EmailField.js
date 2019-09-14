import React, { useEffect, useRef } from 'react'
import { Field } from 'react-final-form'
import FieldWrapper from './FieldWrapper'

const EmailField = ({ name = 'email', label, autoComplete, ...rest }) => {
  return (
    <Field
      name={name}
      render={({ input, meta }) => {
        return (
          <FieldWrapper isEmpty={!input.value} label={label}>
            <input {...input} type="email" {...rest} />
            {meta.touched && meta.error && <span>{meta.error}</span>}
          </FieldWrapper>
        )
      }}
    />
  )
}

export default EmailField