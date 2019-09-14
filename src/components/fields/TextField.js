import React from 'react'
import { Field } from 'react-final-form'

import styles from './styles.scss'
import FieldWrapper from './FieldWrapper'

const TextField = ({ name = 'text', label, initialValue, ...rest }) => {
  return (
    <Field
      name={name}
      initialValue={initialValue}
      render={({ input, meta }) => (
        <FieldWrapper isEmpty={!input.value} label={label}>
          <input {...input} type="text" {...rest} />
          {meta.touched && meta.error && <span>{meta.error}</span>}
        </FieldWrapper>
      )}
    />
  )
}

export default TextField