import React, {useState, useEffect, useRef} from 'react';
import '../scss/App.scss';
import {csv} from 'd3-fetch'
import {select} from 'd3-selection'
import {transition} from 'd3-transition'

// components
import Loader from "./components/Loader.js"
import Intro from "./components/Intro.js"
import Placeholder from "./components/Placeholder.js"

// util
import getSubset from "./util/getSubset.js"
import setDemo from "./util/setDemo.js"
import getAgeGroup from "./util/getAgeGroup.js"
import getAgeInterval from "./util/getAgeInterval.js"
import groupBy from "./util/groupBy.js"
import makeId from "./util/makeId.js"

// graphics
import Silhouettes from "./graphics/Silhouettes.js"
import MostRecentShootingsTable from "./graphics/MostRecentShootingsTable.js"
import ShootingsByYear from "./graphics/ShootingsByYear.js"
import ByCityTable from "./graphics/ByCityTable.js"
import ShootingsMap from "./graphics/ShootingsMap.js"
import ClusterMap from "./graphics/ClusterMap.js"
import MultiVictimTable from "./graphics/MultiVictimTable.js"
import AgeAndGenderPlot from "./graphics/AgeAndGenderPlot.js"



function debounce(fn, ms) {
  let timer
  return _ => {
    clearTimeout(timer)
    timer = setTimeout(_ => {
      timer = null
      fn.apply(this, arguments)
    }, ms)
  };
}



function App() {

  console.log(`
------
Last deployed on 2024-05-14
------
  `
  )

  const [data, setData] = useState(undefined)

  useEffect(() => {
    csv("https://www.googleapis.com/drive/v3/files/15l4G2w4PD4RRJLozI9c9ma0sexXYF4kv?alt=media&key=AIzaSyCmo9e2erA8mwwIXl5NGLTxsHEin8JajNQ&" + makeId(100)).then((shootings) => {
    // csv("https://www.gannett-cdn.com/delaware-online/datasets/delaware-shootings/shootings.csv").then((shootings) => {
      shootings.forEach(function (obj) {
        obj.demo = setDemo(obj);
        obj.datetime = new Date(obj.date)
        // obj.time ? obj.datetime.setHours(obj.time.split(':')[0], obj.time.split(':')[1]) : obj.datetime.setHours(0)
        obj.year = new Date(obj.date).getFullYear()
        obj.age = obj.age.length ? Number(obj.age) : undefined
        obj.latitude = Number(obj.latitude)
        obj.longitude = Number(obj.longitude)
        obj.age_group = getAgeGroup(obj.age)
        obj["age interval"] = getAgeInterval(obj.age)
        obj.homicide = obj.homicide == "-1" ? "yes" : "no"
        obj.officer_involved = obj.officer_involved == "-1" ? "yes" : "no"
      });

      shootings
      .sort((a, b) => new Date(b.date) - new Date(a.date) || b.time.replace(":","") - a.time.replace(":",""))
      let data = {}
      data.shootings = shootings
      setData(data)
      select(".topper__inner").transition().duration(500).style("opacity", 1)

    })

  }, [])

  const [dimensions, setDimensions] = React.useState({
    width: window.innerWidth
  })

  useEffect(() => {

    const debouncedHandleResize = debounce(function handleResize() {

      if (dimensions.width !== window.innerWidth) {
            setDimensions({
              width: window.innerWidth
            })
      }

    }, 1000)

    window.addEventListener('resize', debouncedHandleResize)

    return _ => {
      window.removeEventListener('resize', debouncedHandleResize)
    }
  })

  let isMobile = dimensions.width < 480;

  const introRef = useRef(null)
  const executeScroll = () => introRef.current.scrollIntoView()

  return (
    <div className="App">
    {
      data && data.shootings ?
      <>
        {isMobile ? <div id="g-skip-intro"> <button onClick={executeScroll}> Skip intro </button></div> : ''}
        <Silhouettes data={getSubset(data.shootings, "year")}/>
        <section className="sectioned" style={{backgroundColor:"#ffffff", position: "relative"}}>
          <div ref={introRef} style={{visibility:"hidden", position: "absolute", top: -100}}></div>
          <Intro />
          <MostRecentShootingsTable data={data.shootings}/>
          <ShootingsByYear data={data.shootings} isMobile={isMobile}/>

          <AgeAndGenderPlot data={data.shootings}/>

          <MultiVictimTable data={data.shootings} isMobile={isMobile}/>

          <ClusterMap data={data.shootings}/>

          <ByCityTable data={data.shootings} isMobile={isMobile}/>

        </section>
      </>
      : <Loader/>
    }
    </div>
  );
}

export default App;
