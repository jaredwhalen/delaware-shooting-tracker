import React, { Component } from "react";
import { select } from "d3-selection";
import { scaleLinear, scaleTime } from "d3-scale";
import { max, extent } from "d3-array";
import { timeFormat } from "d3-time-format";
import { timeDay, timeMonth } from "d3-time";
import { line, area } from "d3-shape";
import { easeLinear } from "d3-ease";
import { axisBottom, axisLeft } from "d3-axis";
import { format } from "d3-format";

import tooltip from "./tooltip.js";

import getDimensions from "../util/getDimensions.js";
import makeYGridlines from "./makeYGridlines.js";
import doyFromDate from "../util/doyFromDate.js";
import dateFromDoy from "../util/dateFromDoy.js";

require("../../scss/components/charts.scss");

class LineChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dimensions: null,
    };

    this.createChart = this.createChart.bind(this);
  }

  componentDidMount() {
    this.setState({
      dimensions: {
        width: this.container.offsetWidth,
        height: this.container.offsetHeight,
      },
    });

    this.state.dimensions && this.createChart();
  }

  componentDidUpdate() {
    this.createChart();
  }

  createChart() {
    let { data } = this.props;

    let years = data
      .map((d) => d.year)
      .filter((value, index, self) => self.indexOf(value) === index);

    function leapyear(year) {
      return year % 100 === 0 ? year % 400 === 0 : year % 4 === 0;
    }

    function dateFromDay(year, day) {
      var date = new Date(year, 0); // initialize a date in `year-01-01`
      return new Date(date.setDate(day)); // add the number of days
    }

    var sumstat = [];
    var yearlyTotals = [];

    years
      .sort()
      .slice(years.length - 5, years.length)
      .forEach(function (d, i) {
        sumstat.push({
          year: d,
          points: [],
        });

        var yearly = data.filter((x) => x.year == d);
        var count = 0;
        var cumu = 0;

        var daysInYear;
        if (leapyear(d)) {
          daysInYear = 366;
        } else {
          daysInYear = 365;
        }

        for (var j = 1; j < daysInYear; j++) {
          let day = [];
          day.push(yearly.filter(d => doyFromDate(d.datetime) == j))
          
          count = day[0].length;
          if (dateFromDay(d, j) > new Date()) {
            cumu = null;
          } else {
            cumu += count;
          }

          if (d == 2024 && j == 83) {
            // console.log(day, dateFromDay(d, j), doyFromDate(d.datetime));
          }

          sumstat[i].points.push({
            y: cumu,
            x: dateFromDay(d, j),
          });

          j === daysInYear - 1 && yearlyTotals.push(cumu);
        }
      });

    let dimensions = getDimensions(this.container.offsetWidth, 450);

    var xScales = {};

    years.forEach((d) => {
      xScales["scale" + d] = scaleTime()
        .domain([new Date(+d, 0, 1), new Date(+d, 11, 31)])
        .range([0, dimensions.boundedWidth]);
    });

    let node = this.node;
    select(node).html("");
    let bounds = select(node)
      .append("g")
      .style(
        "transform",
        `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`
      );

    let yScale = scaleLinear()
      .range([dimensions.boundedHeight, 0])
      .domain([0, max(yearlyTotals)]);

    makeYGridlines(bounds, yScale, dimensions);

    var chartGroup = bounds.append("g").attr("class", "chartGroup");

    var paths = chartGroup
      .selectAll("foo")
      .data(sumstat)
      .enter()
      .append("path");

    var thisYear;

    var lineGenerator = line()
      .x((d) => xScales[thisYear](d.x))
      .y((d) => yScale(d.y))
      .defined(function (d) {
        return d.y;
      });

    paths
      .attr("d", (d) => {
        thisYear = "scale" + d.year;
        return lineGenerator(d.points);
      })
      .attr("class", function (d) {
        if (d.year == new Date().getFullYear()) {
          return "g-line current ";
        }
        if (d.year == new Date().getFullYear() - 1) {
          return "g-line previousYear";
        } else {
          return "g-line";
        }
      })
      .attr("fill", "none");

    let xAxisGenerator = axisBottom()
      .tickFormat(timeFormat("%b."))
      .scale(xScales["scale2017"])
      .tickSize(0);

    let xAxis = bounds
      .append("g")
      .call(xAxisGenerator)
      .style("transform", `translateY(${dimensions.boundedHeight}px)`)
      .attr("class", "x axis alternate");

    let yAxisGenerator = axisLeft()
      .scale(yScale)
      .ticks(4, "s")
      .tickFormat((d) => format("~s")(d));

    let yAxis = bounds.append("g").call(yAxisGenerator).attr("class", "y axis");

    tooltip(bounds, chartGroup, sumstat, "y", dimensions, xScales, yScale);
  }
  render() {
    const { dimensions } = this.state;
    return (
      <div className="g-pod-chart" ref={(el) => (this.container = el)}>
        {dimensions && (
          <svg
            className="g-chart line"
            ref={(node) => (this.node = node)}
            width={dimensions.width}
            height={450}
          ></svg>
        )}
      </div>
    );
  }
}
export default LineChart;
