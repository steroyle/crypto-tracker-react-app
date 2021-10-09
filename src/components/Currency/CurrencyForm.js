import React from 'react'

const CurrencyForm = (props) => {

  return (
    <form className="my-4 space-x-2">
      <label>Currency</label>
      <select
        className="p-2 border border-blue-200 rounded"
        name="currency"
        value={props.currency}
        onChange={props.onCurrencyChange}
      >
        {props.currencies.map((cur) => {
          return (
            <option key={cur} value={cur}>{cur.toUpperCase()}</option>
          )
        })}
      </select>
    </form>
  )
}

export default CurrencyForm