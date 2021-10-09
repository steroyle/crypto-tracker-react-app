import React from 'react'

const CoinFilter = (props) => {
  return (
    <form onSubmit={(event) => { event.preventDefault() }}>
      <input
        className="p-2 border border-blue-200 rounded"
        type="text"
        placeholder="Search coins"
        value={props.search}
        onChange={props.onSearchChange}
      />
    </form>
  )
}

export default CoinFilter