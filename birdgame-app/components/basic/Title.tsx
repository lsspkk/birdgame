import React, { ReactElement } from 'react'

import { Props } from '../Layout'

function Title({ children }: Props): ReactElement {
  return <div className="text-red-700 py-5 rounded  text-2xl">{children}</div>
}
export { Title }
