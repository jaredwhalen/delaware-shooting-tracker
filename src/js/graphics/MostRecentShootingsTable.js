import React, {useState, useEffect} from "react"
import "../../scss/components/MostRecentShootingsTable.scss"
import InfiniteScroll from 'react-infinite-scroll-component';
import Pod from '../components/Pod.js'
import ShootingsFilter from "../components/ShootingsFilter.js"
import getSubset from "../util/getSubset.js"
import groupBy from "../util/groupBy.js"
import convert24HourTimeToStandard from "../util/convert24HourTimeToStandard.js"
import nestedFilter from "../util/nestedFilter.js"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExternalLinkAlt} from '@fortawesome/free-solid-svg-icons'
import isPlural from "../util/isPlural.js"
import Card from "./Card.js"
import Loader from "../components/Loader.js"

var initObj = {}

export default function MostRecentShootings(props) {
  let [filters, setFilters] = useState([`year:${new Date().getFullYear() == props.data[0].year ? new Date().getFullYear() : props.data[0].year}`])
  let [search, setSearch] = useState("")
  let [numberToLoad, setNumberToLoad] = useState(10)

  let scrollToTopOfDiv = () => document.querySelector("#g-most-recent-shootings-table-wrapper").scrollTo(0, 0)

  let addFilter = f => {
    setFilters([...filters, f])
    setNumberToLoad(10)
    scrollToTopOfDiv()
    updateInfiniteScroll()
  }

  let removeFilter = f => {
    setFilters(filters.filter(x => x !== f))
    setNumberToLoad(10)
    scrollToTopOfDiv()
    updateInfiniteScroll()
  }


  let onSearch = q => {
    setSearch(q.target.value.toLowerCase())
    scrollToTopOfDiv()
  }

  let [initLoad, setInitLoad] = useState(true)

  const loadInitObj = () => {
    let subsetWeek = getSubset(props.data, "week")
    initObj.woundedWeek = subsetWeek.filter(x => x.homicide === "no").length
    initObj.killedWeek = subsetWeek.filter(x => x.homicide === "yes").length
    initObj.groupByIncidentWeek = groupBy(subsetWeek, "incident_id")
    initObj.groupByIncident = groupBy(props.data, "incident_id")
    initObj.groupByIncident.forEach(d => d.forEach(x => x["multiple victims"] = d.length > 1 ? "yes" : "no"))
    setInitLoad(false)
  }

  initLoad && loadInitObj()


  let j = {}

  filters.forEach(f => {
    let pair = f.split(":")
    j[pair[0].toLowerCase()] = pair[1]
  })

  let x = nestedFilter(initObj.groupByIncident, j)


  let y = x.filter(d => {
    let a = d.filter(x => `${x.first_name} ${x.last_name}`.toLowerCase().includes(search))
    return a.length > 0
  })


  let CardComponents = Object.keys(y).slice(0, numberToLoad).map(function(key, index) {

    let incident = y[key]
    let wounded = incident.filter(x => x.homicide === "no").length
    let killed = incident.filter(x => x.homicide === "yes").length

    return(<Card container='g-table' incident={incident} wounded={wounded} killed={killed} mostRecent={props.data[0].incident_id}/>)
  });


  let totalNumber = Object.keys(y).length

  const updateInfiniteScroll = () => {
    setNumberToLoad(numberToLoad + 10)
  }

  let filteredVictims = y.flat().filter(function(item) {
    for (var key in j) {
      if (item[key] === undefined || item[key] != j[key])
        return false;
    }
    return true;
  });

  return (
    <Pod
      id='recent-shootings'
      heading='Search shooting incidents'
      chatter={`Over the past week, there have been <b>${initObj.groupByIncidentWeek.length} shootings incidents</b>, leaving <span class="g-underline wounded">${initObj.woundedWeek} people wounded</span> and <span class="g-underline killed">${initObj.killedWeek} killed</span>.`}
    >
      {filters.length ? <p className='g-p-project'><b>{Object.keys(y).length} incident{isPlural(Object.keys(y).length) ? 's' : ''}</b> of gun violence and <b>{filteredVictims.length} victim{isPlural(filteredVictims.length) ? 's' : ''}</b> match your filters. {y.flat().length === filteredVictims.length ? '' : <>A total of <b>{y.flat().length} victim{isPlural(y.flat().length) ? 's' : ''}</b> were involved in these incidents.</>}</p> : ''}
      <h5 className="g-instruction">Filters</h5>
      <ShootingsFilter
        addFilter={addFilter}
        removeFilter={removeFilter}
        onSearch={onSearch}
        filters={filters}
        data={y}
      />
      <div id="g-most-recent-shootings-table">
        <div id="g-most-recent-shootings-table-wrapper">
          <InfiniteScroll
            dataLength={CardComponents.length} //This is important field to render the next data
            hasMore={true}
            next={updateInfiniteScroll}
            loader=''
            scrollableTarget="g-most-recent-shootings-table-wrapper"
            endMessage=''
          >
            {CardComponents}
          </InfiniteScroll>
        </div>
        <div className="g-note">Delaware Online/The News Journal identifies a shooting incident as when a reported shooting or multiple shootings that result in at least one victim being wounded or killed occur at roughly the same time and location. Multiple shooting incidents may be connected, but if they occur at different times and locations they are recorded individually.</div>
      </div>
    </Pod>
        )
}
