import * as React from 'react'
import uuid from 'nanoid'

import { List } from './List'

let id = 1
const generateItems = count =>
  Array(count)
    .fill(0)
    .map(_ => ({ id: id++, value: uuid() }))

const rowStyles = {
  backgroundColor: '#ddd',
  border: '1px solid #aaa',
  display: 'grid',
  gridTemplateColumns: '20% auto',
  padding: 0,
}

const Row = ({ data, style }) => {
  return (
    <div style={{ ...rowStyles, ...style }}>
      <span style={{ fontWeight: 'bold' }}>{data.id}</span>
      <span>{data.value}</span>
    </div>
  )
}

const titleStyles: React.CSSProperties = {
  fontWeight: 'bold',
}

export const Example = () => {
  const [items, setItems] = React.useState(generateItems(1000))
  const [working, setWorking] = React.useState(false)

  const handleBump = () => {
    id = 0
    setWorking(true)
  }

  React.useEffect(() => {
    if (working) {
      if (items.length >= 50000) {
        setWorking(false)
      } else {
        setItems([...items, ...generateItems(2500)])
      }
    }
  }, [items, working])

  return (
    <>
      <div style={titleStyles}>Total items: {items.length}</div>

      <button onClick={handleBump}>Bump to 50k rows</button>
      <span>(This will take a while)</span>

      {working ? (
        <div>Hey, just hang on, okay?</div>
      ) : (
        <div style={{ marginTop: 24 }}>
          <div style={{ position: 'relative' }}>
            <List
              height={320}
              itemHeight={20}
              items={items}
              rowRenderer={listRowProps => <Row {...listRowProps} />}
            />
          </div>
        </div>
      )}
    </>
  )
}
