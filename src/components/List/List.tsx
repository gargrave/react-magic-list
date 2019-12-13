import * as React from 'react'

export type ListProps = {}

export const List: React.FC<ListProps> = React.memo(() => {
  return <div>Hello, List!</div>
})
