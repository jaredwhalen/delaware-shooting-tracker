import React, {useState, useEffect} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faSearch} from '@fortawesome/free-solid-svg-icons'
import getUniqueValuesByKey from "../util/getUniqueValuesByKey.js"
import capitalizeFirstLetter from "../util/capitalizeFirstLetter"

require('../../scss/components/ShootingsFilter.scss')



export default function ShootingsFilter(props) {

  let data = props.data.flat()

  let initObj = {}

  // let [initLoad, setInitLoad] = useState(true)

  // const loadInitObj = () => {
    initObj.years = getUniqueValuesByKey(data, "year")
    initObj.optionsArr = ["year", "gender", "city", "homicide", "age_group", "officer_involved"]
    initObj.filterArr = []

    initObj.optionsArr.forEach(k => {

      let obj = {}
      obj.name = k

      let options = []
      getUniqueValuesByKey(data, k).map(o => o !== "" && options.push({
        value: o
      }))
      options.sort((a, b) => a.value.toString() - b.value.toString())

      obj.options = options.sort(function(a, b) {
        a = a.value.toString().toLowerCase();
        b = b.value.toString().toLowerCase();
        return a < b ? -1 : a > b ? 1 : 0;
      })

      initObj.filterArr.push(obj)
    })

    initObj.filterArr.push({
      name: "multiple victims",
      options: [{
          value: "no"
        },
        {
          value: "yes"
        }
      ]
    })
    // setInitLoad(false)
  // }

  // initLoad && loadInitObj()

  let activeProperties = props.filters.map(f => {
    let pair = f.split(":")
    return(pair[0])
  })


  let FilterComponents = initObj.filterArr.filter(d => d.options.length > 1).map(d => {

    return(
      <div className="g-filter" data-active={activeProperties.includes(d.name) ? true : false}>
        <div className="g-filter-label">+ {capitalizeFirstLetter(d.name.replace("_", " "))}</div>
        <div className="g-filter-dropdown">
          {d.options.map(m => <div
            className="g-filter-dropdown-option"
            data-list={d.name}
            data-option={m.value}
            onClick={() => props.addFilter(`${d.name.toLowerCase()}:${m.value}`)}
          >{capitalizeFirstLetter(m.value)}</div>)}
        </div>
      </div>
    )
  })

  let ActiveFilterComponents = props.filters.map(f => {
    let pair = f.split(":")
    return(
      <div className="g-active-filter" onClick={() => props.removeFilter(f)}>
        {capitalizeFirstLetter(pair[0].replace("_", " "))}: <b>{capitalizeFirstLetter(pair[1])}</b> <FontAwesomeIcon icon={faTimes}/>
      </div>
    )
  })


  return(
    <>
    <div id="g-most-recent-shootings-filter">
      {FilterComponents}
      <div id="victim-search">
        <FontAwesomeIcon icon={faSearch}/>
        <input type="search" name="q" aria-label="Search by name" placeholder="Search by name" onChange={(e) => props.onSearch(e)}/>
      </div>
    </div>
    <div id="g-active-filters">
      {ActiveFilterComponents}
    </div>
    </>
  )
}
