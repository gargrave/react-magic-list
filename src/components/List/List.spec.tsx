import * as React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { cleanup, fireEvent, render } from '@testing-library/react'

import * as listHelpers from './List.helpers'

import { List, ListProps } from './List'

type Item = {
  id: string
  value: string
}

const ITEM_HEIGHT = 10
const ITEM_COUNT = 10
const LIST_HEIGHT = ITEM_HEIGHT * (ITEM_COUNT / 2)
const ITEM_CLASS = 'listItem'

const itemMaker = () => {
  let nextId = 1
  return (): Item => {
    const id = `${nextId++}`
    return { id, value: `item--${id}` }
  }
}

const makeItem = itemMaker()

const items: Item[] = Array(ITEM_COUNT)
  .fill(0)
  .map(makeItem)

const rowRenderer = ({ item }) => <div className={ITEM_CLASS}>{item.value}</div>

let defaultProps: ListProps<Item>

describe('List', () => {
  const defaultVisibleItemCount = LIST_HEIGHT / ITEM_HEIGHT + 1

  beforeEach(() => {
    jest.resetAllMocks()
    defaultProps = {
      getKey: jest.fn((item, _idx) => item.id),
      height: LIST_HEIGHT,
      itemHeight: ITEM_HEIGHT,
      items,
      rowRenderer,
    }
  })

  afterEach(cleanup)

  describe('Basic Rendering', () => {
    it('renders the expected items when scrolling with default settings', () => {
      const { container, getByText, queryByText } = render(
        <List {...defaultProps} />,
      )
      let scrollTop = 0

      const listEl = container.firstChild as HTMLElement
      expect(listEl).not.toBeNull()

      expect(container.querySelectorAll(`.${ITEM_CLASS}`)).toHaveLength(
        defaultVisibleItemCount,
      )
      expect(getByText('item--1')).toBeInTheDocument()
      expect(getByText('item--6')).toBeInTheDocument()
      expect(queryByText('item--7')).not.toBeInTheDocument()

      // scroll by "less than 1px of item height" and ensure nothing changed
      scrollTop += ITEM_HEIGHT - 1
      fireEvent.scroll(listEl, { target: { scrollTop } })
      expect(getByText('item--1')).toBeInTheDocument()
      expect(getByText('item--6')).toBeInTheDocument()
      expect(queryByText('item--7')).not.toBeInTheDocument()

      // scroll one more and ensure list has re-rendered correctly
      scrollTop += 1
      fireEvent.scroll(listEl, { target: { scrollTop } })
      expect(queryByText('item--1')).not.toBeInTheDocument()
      expect(getByText('item--2')).toBeInTheDocument()
      expect(getByText('item--7')).toBeInTheDocument()
      expect(queryByText('item--8')).not.toBeInTheDocument()

      // scroll one more item height ensure list has re-rendered correctly
      scrollTop += ITEM_HEIGHT
      fireEvent.scroll(listEl, { target: { scrollTop } })
      expect(queryByText('item--2')).not.toBeInTheDocument()
      expect(getByText('item--3')).toBeInTheDocument()
      expect(getByText('item--8')).toBeInTheDocument()
      expect(queryByText('item--9')).not.toBeInTheDocument()

      // scroll back to zero and ensure we are back to original state
      scrollTop = 0
      fireEvent.scroll(listEl, { target: { scrollTop } })
      expect(getByText('item--1')).toBeInTheDocument()
      expect(getByText('item--6')).toBeInTheDocument()
      expect(queryByText('item--7')).not.toBeInTheDocument()
    })
  })

  describe('props', () => {
    let defaultGetKeySpy: jest.SpyInstance

    beforeEach(() => {
      defaultGetKeySpy = jest.spyOn(listHelpers, 'DEFAULT_GET_KEY')
    })

    describe('getKey', () => {
      it('uses a default "getKey()" prop when none is provided', () => {
        render(<List {...defaultProps} getKey={undefined} />)

        expect(defaultGetKeySpy).toHaveBeenCalledTimes(defaultVisibleItemCount)
      })

      it('uses a custom "getKey()" prop when provided', () => {
        const { getKey } = defaultProps
        render(<List {...defaultProps} />)

        expect(defaultGetKeySpy).toHaveBeenCalledTimes(0)
        expect(getKey).toHaveBeenCalledTimes(defaultVisibleItemCount)
      })
    })
  })
})
