import React, {Component} from "react"
import "../../scss/components/gTable.scss"
import "../../scss/components/ShootingsByYear.scss"
import Pod from '../components/Pod.js'
import LineChart from "./LineChart.js"
import groupBy from "../util/groupBy.js"
import filterObjectsByDate from "../util/filterObjectsByDate.js"
import getMonthName from "../util//getMonthName.js"



class ShootingsByYear extends Component {

  constructor(props) {
    super(props)
    this.state = {
      dimensions: null,
    };
  }

  componentDidMount() {
    this.setState({
      dimensions: {
        width: this.container.offsetWidth
      },
    });
  }

  render() {

    let groupByYear = groupBy(this.props.data, "year")

    let textVariables = {}

    let RowComponents = groupByYear.map(d => {
      let year = d[0].year;
      let incidentsAnnual = d.map( (value) => value.incident_id).filter( (value, index, _arr) => _arr.indexOf(value) == index).length;
      let woundedAnnual = d.filter(x => x.homicide === "no").length
      let homicidesAnnual = d.filter(x => x.homicide === "yes").length

      let dYTD = filterObjectsByDate(d)

  

      let incidentsYTD = dYTD.map( (value) => value.incident_id).filter( (value, index, _arr) => _arr.indexOf(value) == index).length;
      let woundedYTD = dYTD.filter(x => x.homicide === "no").length
      let homicidesYTD = dYTD.filter(x => x.homicide === "yes").length

      let currentYear = year == new Date().getFullYear()

      if (currentYear) {
        textVariables.current = {year, incidentsYTD, woundedYTD, homicidesYTD}
      } else if (year == new Date().getFullYear() - 1 ){
        textVariables.lastYear = {year, incidentsYTD, woundedYTD, homicidesYTD}
      }

      if (!dYTD.length) {
        textVariables.current = {year: new Date().getFullYear(), incidentsYTD: 0, woundedYTD: 0, homicidesYTD: 0}
      }
 
      return(
        <tr>
          <td className="border-right">{year}</td>
          <td>{incidentsAnnual}</td>
          <td>{woundedAnnual}</td>
          <td>{homicidesAnnual}</td>
          <td className="border-right">{homicidesAnnual + woundedAnnual}</td>
          <td>{incidentsYTD}</td>
          <td>{woundedYTD}</td>
          <td>{homicidesYTD}</td>
          <td>{homicidesYTD + woundedYTD}</td>
        </tr>
      )

    })

    textVariables.change = ((textVariables.current.incidentsYTD - textVariables.lastYear.incidentsYTD) / textVariables.lastYear.incidentsYTD * 100).toFixed(1)

    if (textVariables.change > 0) {
      textVariables.changeText = `up ${textVariables.change}% from`
    } else if (textVariables.change < 0) {
      textVariables.changeText = `down ${textVariables.change}% from`
    } else {
      textVariables.changeText = 'the same as it was'
    }


    return (
      <Pod
        id='shootings-by-year'
        heading='Shootings victims by year'
        chatter={`So far in ${textVariables.current.year}, there have been ${textVariables.current.incidentsYTD} shooting incidents, leaving ${textVariables.current.woundedYTD} people wounded and ${textVariables.current.homicidesYTD} killed. The number of incidents is ${textVariables.changeText} this point last year.`}
      >

      <div className='g-pod-chart-legend'>
        <div className='g-pod-chart-legend-item'>
          <div className='g-pod-chart-legend-item-symbol line current'></div>{textVariables.current.year}
        </div>
        <div className='g-pod-chart-legend-item'>
          <div className='g-pod-chart-legend-item-symbol line previous'></div>{textVariables.current.year - 1}
        </div>
      </div>
      <LineChart data={this.props.data} />

        <div id="g-shootings-by-year" className="g-table-container">
        {this.state.dimensions && (this.props.isMobile && this.state.dimensions.width > window.innerWidth) ? <h5 className="g-instruction">Scroll right →</h5> : ''}
          <div id="g-shootings-by-year-wrapper" className="g-table-wrapper">
            <table ref={el => (this.container = el)}>
              <tbody>
                <tr className="g-table-header-no-border white">
                  <th rowSpan="1"></th>
                  <th colSpan="4" scope="colgroup">Annual total</th>
                  <th colSpan="4" scope="colgroup">Year-to-date ({getMonthName(new Date().getMonth())} {new Date().getDate()})</th>
                </tr>
                <tr className="colored">
                  <th className="border-right">Year</th>
                  <th>Incidents</th>
                  <th>Wounded</th>
                  <th>Killed</th>
                  <th className="border-right">Victims</th>
                  <th>Incidents</th>
                  <th>Wounded</th>
                  <th>Killed</th>
                  <th>Victims</th>
                </tr>
              {RowComponents}
              </tbody>
            </table>
          </div>
          <div className="g-note">Delaware Online/The News Journal identifies a shooting victim as someone wounded or killed by gunfire. Occasionally, this may include a shooting that concludes in a neighboring state if and when the pursuit began in Delaware and was directly connected with another shooting.</div>
        </div>
      </Pod>
    )
  }
}

export default ShootingsByYear
