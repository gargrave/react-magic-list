import { CSSProperties } from 'react'

export const makeContainerStyles = ({ height }): CSSProperties => ({
  height,
  overflowY: 'auto',
})

export const makeListWrapperStyles = ({
  itemCount,
  itemHeight,
}): CSSProperties => ({
  height: itemHeight * itemCount,
  position: 'relative',
  width: '100%',
})

export const makeRowStyles = ({ top }): CSSProperties => ({
  left: 0,
  position: 'absolute',
  right: 0,
  top,
})
