import React, {Component} from "react"
import "../../scss/components/gTable.scss"
import Pod from '../components/Pod.js'
import groupBy from "../util/groupBy.js"
import getDayOfYear from "../util/getDayOfYear.js"
import getMonthName from "../util//getMonthName.js"


class MultiVictimTable extends Component {

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

      let groupByIncident = groupBy(d, "incident_id")
      let threeVictimsAnnual = groupByIncident.filter(v => v.length == 3).length
      let fourOrMoreVictimsAnnual = groupByIncident.filter(v => v.length >= 4).length

      let groupByIncidentYTD = groupBy(d.filter(x => getDayOfYear(x.datetime) <= getDayOfYear()), "incident_id")
      let threeVictimsYTD = groupByIncidentYTD.filter(v => v.length == 3).length
      let fourOrMoreVictimsYTD = groupByIncidentYTD.filter(v => v.length >= 4).length

      return(
        <tr>
          <td className="border-right">{year}</td>
          <td>{threeVictimsAnnual}</td>
          <td className="border-right">{fourOrMoreVictimsAnnual}</td>
          <td>{threeVictimsYTD}</td>
          <td>{fourOrMoreVictimsYTD}</td>
        </tr>
      )

    })
    return (
      <Pod
        id='multi-victim-shootings'
        heading='Multi-victim shooting incidents by year'
      >
        <div id="g-multi-victim-shootings" className="g-table-container">
        {this.state.dimensions && (this.props.isMobile && this.state.dimensions.width > window.innerWidth) ? <h5 className="g-instruction">Scroll right →</h5> : ''}
          <div id="g-multi-victim-shootings-wrapper" className="g-table-wrapper">
            <table ref={el => (this.container = el)}>
              <tbody>
                <tr className="g-table-header-no-border white">
                  <th rowSpan="1"></th>
                  <th colSpan="2" scope="colgroup">Annual total</th>
                  <th colSpan="2" scope="colgroup">Year-to-date ({getMonthName(new Date().getMonth())} {new Date().getDate()})</th>
                </tr>
                <tr className="colored">
                  <th className="border-right">Year</th>
                  <th>Incidents with 3 victims</th>
                  <th className="border-right">4 or more victims</th>
                  <th>3 victims</th>
                  <th>4 or more victims</th>
                </tr>
              {RowComponents}
              </tbody>
            </table>
          </div>
        </div>
      </Pod>
    )
  }
}

export default MultiVictimTable
