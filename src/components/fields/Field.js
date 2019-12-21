import React, { useState, useEffect, useRef } from 'react'
import { Field } from 'react-final-form'

import styles from './styles.scss'
import FieldWrapper from './FieldWrapper'

const _Field = ({ type = "text", name = 'text', label, initialValue, children, ...rest }) => {
  const [autofilled, setAutofilled] = useState(false)
  const inputRef = useRef()

  useEffect(() => {
    const onAnimationStart = (e) => {
      setAutofilled(true)
      inputRef.current.removeEventListener('animationstart', onAnimationStart)
    }

    inputRef.current.addEventListener('animationstart', onAnimationStart)

    return () => {
      inputRef.current.removeEventListener('animationstart', onAnimationStart)
    }
  }, [])

  return (
    <Field
      name={name}
      initialValue={initialValue}
      render={({ input, meta }) => (
        <FieldWrapper isEmpty={!autofilled && !input.value} label={label}>
          <input ref={inputRef} {...input} type={type} {...rest} />
          {meta.touched && meta.error && <span>{meta.error}</span>}
          {children}
        </FieldWrapper>
      )}
    />
  )
}

export default _Field
