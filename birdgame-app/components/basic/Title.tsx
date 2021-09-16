import React, { HTMLAttributes, ReactElement } from 'react'

function Title({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>): ReactElement {
  const addClasses = className === undefined ? '' : className
  return (
    <div
      {...props}
      className={`text-red-700 py-5 rounded text-2xl ${addClasses}`}
    >
      {children}
    </div>
  )
}
export { Title }
