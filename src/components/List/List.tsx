import * as React from 'react'

import {
  makeContainerStyles,
  makeListWrapperStyles,
  makeRowStyles,
} from './styles'
import { RowProps } from './types'

export type ListProps<T> = {
  height: number
  itemHeight: number
  itemMargin?: number
  items: T[]
  rowRenderer: (props: RowProps<T>) => React.ReactElement
}

export type ListState = {
  maxIdx: number
  minIdx: number
}

export function List<T>({
  height,
  itemHeight = 0,
  items,
  rowRenderer,
}: ListProps<T>) {
  const containerStyles: React.CSSProperties = React.useMemo(
    () => makeContainerStyles({ height }),
    [height],
  )

  const listWrapperStyles: React.CSSProperties = React.useMemo(
    () => makeListWrapperStyles({ itemCount: items.length, itemHeight }),
    [itemHeight, items.length],
  )

  // the number of items we should expect to be rendered by our list view at any given time
  const visibleItemCount = React.useMemo(() => Math.ceil(height / itemHeight), [
    height,
    itemHeight,
  ])

  const [state, setState] = React.useState<ListState>({
    // TODO: find a default value for this that doesn't cut anything off; it is initially rendering ALL nodes
    maxIdx: 100000,
    minIdx: 0,
  })
  const { maxIdx, minIdx } = state

  // a reference to the top-level list wrapper
  // this is what we will watch for scroll events
  const containerEl = React.useRef<HTMLDivElement>(null)

  /**
   * Callback for handling scroll events
   * The list will need to be re-calculated any time a scroll happens, and new items
   * may or may not need to be rendered.
   */
  const handleScroll = React.useCallback(
    event => {
      const { scrollTop } = event.target

      const newMinIdx = Math.floor(scrollTop / itemHeight)
      const newMaxIdx = newMinIdx + visibleItemCount

      setState({ maxIdx: newMaxIdx, minIdx: newMinIdx })
    },
    [itemHeight, visibleItemCount],
  )

  React.useEffect(() => {
    const el = containerEl.current

    if (el) el.addEventListener('scroll', handleScroll)

    return () => {
      if (el) el.removeEventListener('scroll', handleScroll)
    }
  }, [handleScroll])

  return (
    <div style={containerStyles} ref={containerEl}>
      <div style={listWrapperStyles}>
        {items.map((data, idx) => {
          // skip any rows that are outside our current viewport
          if (idx < minIdx || idx > maxIdx) {
            return null
          }

          const top = idx * itemHeight
          const rowStyles = makeRowStyles({ top })

          const props: RowProps<T> = {
            data,
            // TODO: add a getKey() prop to provide custom logic here
            key: idx,
            style: rowStyles,
          }

          return rowRenderer(props)
        })}
      </div>
    </div>
  )
}
