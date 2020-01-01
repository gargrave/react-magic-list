import { CSSProperties } from 'react'

export type RowProps<T> = {
  // TODO: `item` might be a better name for this
  data: T
  key: number | string
  style: CSSProperties
}
