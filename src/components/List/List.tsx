import * as React from 'react'

import { DEFAULT_GET_KEY } from './List.helpers'
import {
  makeContainerStyles,
  makeListWrapperStyles,
  makeRowStyles,
} from './styles.helpers'
import { RowProps } from './types'

export type DebugOptions = {
  disableVirtualization?: boolean
}

export type ListProps<T> = {
  debugOptions?: DebugOptions
  getKey?: (item: T, idx: number) => string | number
  height: number
  itemHeight: number
  items: T[]
  rowRenderer: (props: RowProps<T>) => React.ReactElement
}

export type ListState = {
  maxIdx: number
  minIdx: number
}

export function List<T>({
  debugOptions = {},
  getKey = DEFAULT_GET_KEY,
  height,
  itemHeight,
  items,
  rowRenderer,
}: ListProps<T>) {
  const { disableVirtualization = false } = debugOptions

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
    maxIdx: visibleItemCount,
    minIdx: 0,
  })
  const { maxIdx, minIdx } = state

  // a reference to the top-level list wrapper
  // this is what we will watch for scroll events
  const containerEl = React.useRef<HTMLDivElement>(null)

  /**
   * Updates the min & max indices for which items should be rendered in our current viewport.
   */
  const updateVisibleItems = React.useCallback(
    (scrollTop = 0) => {
      const newMinIdx = Math.floor(scrollTop / itemHeight)
      const newMaxIdx = newMinIdx + visibleItemCount

      setState({ maxIdx: newMaxIdx, minIdx: newMinIdx })
    },
    [itemHeight, visibleItemCount],
  )

  /**
   * Callback for handling scroll events
   * The list will need to be re-calculated any time a scroll happens, and new items
   * may or may not need to be rendered.
   */
  const handleScroll = React.useCallback(
    event => {
      updateVisibleItems(event.target.scrollTop)
    },
    [updateVisibleItems],
  )

  /**
   * Effect handler for binding/unbinding scroll events on the container element
   */
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
        {items.map((item, idx) => {
          // skip any rows that are outside our current viewport
          if (idx < minIdx || idx > maxIdx) {
            if (!disableVirtualization) {
              return null
            }
          }

          const top = idx * itemHeight
          const rowStyles = makeRowStyles({ top })

          const key = getKey(item, idx)
          const props: RowProps<T> = {
            item,
            style: rowStyles,
          }

          return <React.Fragment key={key}>{rowRenderer(props)}</React.Fragment>
        })}
      </div>
    </div>
  )
}
