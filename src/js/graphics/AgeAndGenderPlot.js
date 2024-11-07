import React, {useState} from "react"
import Pod from '../components/Pod.js'
import ColumnChart from './ColumnChart.js'
import groupBy from "../util/groupBy.js"
import YearSelect from "../components/YearSelect.js"
import '../../scss/components/charts.scss'





export default function AgeAndGenderPlot(props) {

  let arr = ["0-4",
    "5-9",
    "10-14",
    "15-19",
    "20-24",
    "25-29",
    "30-34",
    "35-39",
    "40-44",
    "45-49",
    "50-54",
    "55-59",
    "60-64",
    "65-69",
    "70-74",
    "75-79",
    "80-84",
    "85+"
  ]

  let [yearFilter, setYearFilter] = useState(new Date().getFullYear() == props.data[0].year ? new Date().getFullYear() : props.data[0].year)

  

  const onYearChange = e => {
    setYearFilter(e.target.value)
  }

  let [barWidth, setBarWidth] = useState(undefined)


  let groupedByAge = groupBy(props.data.filter(d => (d.year == yearFilter && d["age interval"] !== "Unknown")), "age interval")
  let ageData = groupedByAge.map(d => ({group: d[0]["age interval"], value: d.length}))

  let ageDataFilled = []
  arr.forEach(a => {
    let x = ageData.filter(d => d.group == a)
    x.length ? ageDataFilled.push(x[0]) : ageDataFilled.push({group: a, value: 0})
  }  )

  ageDataFilled.sort(function(b, a) {
    return Number(b.group.split("-")[0]) - Number(a.group.split("-")[0]);
  })

  let groupedByGender = groupBy(props.data.filter(d => d.year == yearFilter && d.gender.length), "gender")

  let genderArr = groupedByGender
  .map(d => ({group: d[0].gender, value: d.length}))



  let GenderComponents = groupedByGender.map(d => (
    <div className='g-chart bar' data-group={d[0].gender}>
      <div className='g-bar-label'>{d[0].gender}</div>
      <div className='g-bar-rect-wrap'>
        <div className='g-bar-rect' style={{"width": `${d.length / groupedByGender.flat().length * 100}%`, "height": barWidth || 0}}> </div>
        <div className='g-bar-rect-number'>{d.length}</div>
      </div>
    </div>
  ))

  return(
    <Pod
      id='age-and-gender-plot'
      heading='Shooting victims by age and gender'
    >
      <YearSelect data={props.data} onYearChange={onYearChange}/>
      <h5 class="g-instruction">Victims by age</h5>
      <ColumnChart data={ageDataFilled} setBarWidth={setBarWidth} />
      <h5 class="g-instruction">Victims by gender</h5>
      <div className='g-pod-chart'>
        {GenderComponents}
      </div>
    </Pod>
  )

}
