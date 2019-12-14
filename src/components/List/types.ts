import { CSSProperties } from 'react'

export type RowProps<T> = {
  data: T
  key: number | string
  style: CSSProperties
}
