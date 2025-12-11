import React, { useState } from 'react'

export default function BatchFilter({ onChange }) {
  const [val, setVal] = useState('')
  function apply() { onChange(val || '') }
  function clearFilter() { setVal(''); onChange('') }

  return (
    <div className="filter-row">
      <input className="filter-input" placeholder="Batch Year" value={val} onChange={e=>setVal(e.target.value)} />
      <button className="btn btn-ghost" onClick={apply}>Show</button>
      <button className="btn" onClick={clearFilter}>All</button>
    </div>
  )
}
