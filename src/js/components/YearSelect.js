import React from 'react'
export default function YearSelect(props) {
  let years = props.data.map(d => d.year).filter((value, index, self) => self.indexOf(value) === index)
  return(<p className='g-pod-select g-p-project'>Show data for <select onChange={(e) => props.onYearChange(e)}>{years.map(y => <option>{y}</option>)}</select></p>)
}
