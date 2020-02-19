import React from 'react'
import { Field } from 'react-final-form'
import Select from 'react-select';

const opts = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' },
];


const SelectField = ({ name = 'text', label, options = opts, ...rest }) => {
  console.log(options)
  return (
    <Field
      label={label}
      name={name}
      {...rest}
    >{({ input }) => {
      return (
        <Select
          value={input.value}
          onChange={input.onChange}
          options={options}
          isMulti={true}
        />
      )
    }}</Field>
  )
}
export default SelectField