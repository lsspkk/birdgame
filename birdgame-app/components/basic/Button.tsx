import React, { ButtonHTMLAttributes, ReactElement } from 'react'

function Button({
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>): ReactElement {
  return (
    <button
      {...props}
      className={`bg-red-200 p-3 rounded shadow-xl ${
        props.className !== undefined ? props.className : ''
      }`}
    >
      {children}
    </button>
  )
}

export { Button }
