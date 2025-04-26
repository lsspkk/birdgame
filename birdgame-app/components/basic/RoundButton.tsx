import React, { ButtonHTMLAttributes, ReactElement } from 'react'

function RoundButton({
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>): ReactElement {
  return (
    <button
      {...props}
      className={`bg-red-200 p-3 rounded-full shadow-xl ${
        props.className !== undefined ? props.className : ''
      }`}
    >
      {children}
    </button>
  )
}

export { RoundButton }
