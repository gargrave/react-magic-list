import * as React from 'react'
import uuid from 'nanoid'

import { List } from '../List'

const numFormat = Intl.NumberFormat('en-us').format

let id = 1
const generateItems = count =>
  Array(count)
    .fill(0)
    // eslint-disable-next-line no-plusplus
    .map(_ => ({ id: id++, value: uuid() }))

const Row = ({ item, style }) => {
  return (
    <div className="listRow" style={style}>
      <span className="listRow__id">{item.id}</span>
      <span>{item.value}</span>
    </div>
  )
}

const NonVirtualized = () => {
  const INCREMENT = 500

  const [state, setState] = React.useState({
    rows: [],
    working: true,
  })
  const { rows, working } = state

  const handleBump = () => {
    if (!working) {
      setState({
        rows,
        working: true,
      })
    }
  }

  React.useEffect(() => {
    if (working) {
      const newRows = generateItems(INCREMENT)
      setState({
        rows: rows.concat(newRows),
        working: false,
      })
    }
  }, [rows, working])

  return (
    <>
      <div>
        <h3>Non-Virtualized List</h3>
        <h4>Total current items: {numFormat(rows.length)}</h4>
        <div>
          <button
            className="button button-outline"
            disabled={working}
            onClick={handleBump}
          >
            Add {numFormat(INCREMENT)} Items
          </button>
        </div>

        <div style={{ marginTop: 24 }}>
          <div style={{ position: 'relative' }}>
            <List
              debugOptions={{ disableVirtualization: true }}
              height={320}
              itemHeight={30}
              items={rows}
              overscanItems={10}
              rowRenderer={listRowProps => <Row {...listRowProps} />}
            />
          </div>
        </div>
      </div>
    </>
  )
}

const Virtualized = () => {
  const INCREMENT = 5000

  const [state, setState] = React.useState({
    rows: [],
    working: true,
  })
  const { rows, working } = state

  const handleBump = () => {
    if (!working) {
      setState({
        rows,
        working: true,
      })
    }
  }

  React.useEffect(() => {
    if (working) {
      const newRows = generateItems(INCREMENT)
      setState({
        rows: rows.concat(newRows),
        working: false,
      })
    }
  }, [rows, working])

  return (
    <>
      <div>
        <h3>Virtualized List</h3>
        <h4>Total current items: {numFormat(rows.length)}</h4>
        <div>
          <button
            className="button button-outline"
            disabled={working}
            onClick={handleBump}
          >
            Add {numFormat(INCREMENT)} Items
          </button>
        </div>

        <div style={{ marginTop: 24 }}>
          <div style={{ position: 'relative' }}>
            <List
              height={320}
              itemHeight={30}
              items={rows}
              overscanItems={10}
              rowRenderer={listRowProps => <Row {...listRowProps} />}
            />
          </div>
        </div>
      </div>
    </>
  )
}

const Example = () => {
  const [toggleView, setToggleView] = React.useState(true)

  const handleToggle = () => {
    id = 1
    setToggleView(!toggleView)
  }

  return (
    <>
      {toggleView ? <Virtualized /> : <NonVirtualized />}
      <hr />
      <div>
        <input
          checked={toggleView}
          id="toggle"
          onChange={handleToggle}
          type="checkbox"
        />
        <label className="label-inline" htmlFor="toggle">
          Virtualized
        </label>
      </div>
    </>
  )
}
