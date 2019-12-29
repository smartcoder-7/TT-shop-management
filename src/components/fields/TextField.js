import React from 'react'
import Field from './Field'

const TextField = ({ name = 'text', label, ...rest }) => {
  return (
    <Field
      type="text"
      label={label}
      name={name}
      {...rest}
    />
  )
}
export default TextField