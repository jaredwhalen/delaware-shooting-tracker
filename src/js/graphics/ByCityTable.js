import React, {Component} from "react"
import "../../scss/components/gTable.scss"
import "../../scss/components/ByCityTable.scss"
import Pod from '../components/Pod.js'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSort, faSortDown, faSortUp} from '@fortawesome/free-solid-svg-icons'
import YearSelect from "../components/YearSelect.js"

import groupBy from "../util/groupBy.js"




export default class ByCityTable extends Component {


  constructor(props) {
    super(props)
    this.state = {
      active: "victims",
      sortAscending: false,
      yearFilter: new Date().getFullYear() == this.props.data[0].year ? new Date().getFullYear() : this.props.data[0].year,
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

  onYearChange = e => {
    this.setState({
      yearFilter: e.target.value
    });
  }

  onHeaderClick = h => {

    this.setState(prevState => ({
      active: h,
      sortAscending: !prevState.sortAscending
    }));
  }



render() {

  let groupByCity = groupBy(this.props.data.filter(d => d.year == this.state.yearFilter && d.city.length), "city")

  let rowData = groupByCity.map(d => {
    let city = d[0].city;
    let year = d[0].year;
    let incidents = d.map( (value) => value.incident_id).filter( (value, index, _arr) => _arr.indexOf(value) == index).length;
    let wounded = d.filter(x => x.homicide == "no").length
    let killed = d.filter(x => x.homicide == "yes").length
    let victims = wounded + killed
    return({
      year, city, incidents, wounded, killed, victims
    })
  })


  let RowComponents = rowData
  .sort((a, b) => {
    if (this.state.active == "city") {
      a = a.city.toLowerCase();
      b = b.city.toLowerCase();
      return(this.state.sortAscending ? ((a < b) ? -1 : (a > b) ? 1 : 0) : ((a > b) ? -1 : (a < b) ? 1 : 0))
    } else {
      return(this.state.sortAscending ? a[this.state.active] - b[this.state.active] : b[this.state.active] - a[this.state.active])
    }

  })
  .map(r => {
    return(
      <tr>
        <td>{r.city}</td>
        <td>{r.incidents}</td>
        <td>{r.wounded}</td>
        <td>{r.killed}</td>
        <td>{r.victims}</td>
      </tr>
    )

  })

  return (
    <Pod
      id='recent-shootings'
      heading='Shootings by city'
    >
    <YearSelect data={this.props.data} onYearChange={this.onYearChange}/>
    <div id="g-shootings-by-city" className="g-table-container">
      {this.state.dimensions && (this.props.isMobile && this.state.dimensions.width > window.innerWidth) ? <h5 className="g-instruction">Scroll right →</h5> : ''}
      <div id="g-shootings-by-city-wrapper" className="g-table-wrapper">
        <table ref={el => (this.container = el)}>
          <tbody>
            <tr className="colored">
              {["city", "incidents", "wounded", "killed", "victims"].map(h => <th className={h == this.state.active ? 'active' : ''} onClick={() => this.onHeaderClick(h)}>{h} <FontAwesomeIcon icon={h == this.state.active ? this.state.sortAscending ? faSortUp : faSortDown : faSort}/></th>)}
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
