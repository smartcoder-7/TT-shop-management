import React from 'react'
import Field from './Field'

const NumberField = ({ name = 'number', label, ...rest }) => {
  return (
    <Field
      type="number"
      label={label}
      name={name}
      {...rest}
    />
  )
}
export default NumberField