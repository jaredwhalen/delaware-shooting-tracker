import React, {Component} from 'react'

import {scaleLinear, scaleBand} from 'd3-scale'
import {max, extent} from 'd3-array'
import {select} from 'd3-selection'
import { timeFormat} from 'd3-time-format'
import {timeDay, timeMonth} from 'd3-time'
import {line, area} from 'd3-shape'
import {easeLinear} from 'd3-ease'
import {axisBottom, axisLeft} from 'd3-axis'
import {format} from 'd3-format'

import getDimensions from '../util/getDimensions.js'
import makeYGridlines from './makeYGridlines.js'


require('../../scss/components/charts.scss')


class ColumnChart extends Component {

  constructor(props) {
    super(props)
    this.state = {
      dimensions: null,
    };

    this.createChart = this.createChart.bind(this)
  }

  componentDidMount() {
    this.setState({
      dimensions: {
        width: this.container.offsetWidth,
        height: this.container.offsetHeight,
      },
    });

    this.state.dimensions && this.createChart()
  }

  componentDidUpdate() {
    this.createChart()
  }

  createChart() {

    let {data} = this.props

    let dimensions = getDimensions(this.container.offsetWidth, 350)

    let node = this.node
    select(node).html('')
    let bounds = select(node)
      .append("g")
      .style("transform", `translate(${
                    dimensions.margin.left
                  }px, ${
                    dimensions.margin.top
                  }px)`)

    let tooltip = select("body")
      .append('div')
      .attr('class', 'g-tooltip')
      .style('display', 'none');


    let xScale = scaleBand()
      .range([ 0, dimensions.boundedWidth ])
      .domain(data.map(function(d) { return d.group; }))
      .padding(0.2);

    let yScale = scaleLinear()
      .domain([0, max(data, d => d.value)])
      .range([dimensions.boundedHeight, 0])

      makeYGridlines(bounds, yScale, dimensions)


    bounds.selectAll("mybar")
        .data(data)
        .enter()
        .append("rect")
          .attr("x", function(d) { return xScale(d.group); })
          .attr("y", function(d) { return yScale(d.value); })
          .attr("width", xScale.bandwidth())
          .attr("height", function(d) { return dimensions.boundedHeight - yScale(d.value); })
          .attr("fill", "#fa9632")
          .on("mousemove", function(event, d){
            let shift = event.pageX < window.innerWidth / 2 ? 20 : 120
            tooltip
              .style("left", event.pageX - shift + "px")
              .style("top", event.pageY - 50 + "px")
              .style("display", "inline-block")
              .html(`Age group: <b>${d.group} years old</b><br>Victims: <b>${d.value}</b>`);
          })
      		.on("mouseout", function(d){ tooltip.style("display", "none");});


      this.props.setBarWidth(xScale.bandwidth())

      let xAxisGenerator = axisBottom()
        .scale(xScale)
        .tickSize(0);

      let xAxis = bounds.append("g")
        .call(xAxisGenerator)
        .style("transform", `translateY(${dimensions.boundedHeight}px)`)
        .attr("class", "x axis")
        .selectAll("text")
        .attr("transform", "translate(-3,1)rotate(-45)")
        .style("text-anchor", "end");


      let yAxisGenerator = axisLeft()
        .scale(yScale)
        .ticks(4, "s")
        .tickFormat(d => format("~s")(d))

      let yAxis = bounds.append("g")
        .call(yAxisGenerator)
        .attr("class", "y axis")


  }
  render() {
    const { dimensions } = this.state;
    return (
      <div className='g-pod-chart' ref={el => (this.container = el)}>
        {dimensions && (
          <svg
            className='g-chart column'
            ref={node => this.node = node}
            width={dimensions.width}
            height={350}>
          </svg>
        )}
      </div>
    )
  }

}
export default ColumnChart
