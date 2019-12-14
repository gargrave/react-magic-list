import * as React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { cleanup, render } from '@testing-library/react'

import { List, ListProps } from './List'

let defaultProps: ListProps<any>

describe('List', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    defaultProps = {
      height: 100,
      itemHeight: 10,
      items: [],
      rowRenderer: () => <div />,
    }
  })

  afterEach(cleanup)

  describe('Basic Rendering', () => {
    it('renders something', () => {
      const { container } = render(<List {...defaultProps} />)
      expect(container.firstChild).not.toBeNull()
    })
  })
})
