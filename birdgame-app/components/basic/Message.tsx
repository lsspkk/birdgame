import React, { ReactElement } from 'react'

import { Props } from '../Layout'

function Message({ children }: Props): ReactElement {
  return (
    <div className="text-gray-700 p-3 rounded text-2xl my-5">{children}</div>
  )
}
export { Message }
