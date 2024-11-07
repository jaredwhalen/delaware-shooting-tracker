import {
  bisector
} from 'd3-array'
import {
  select,
  pointer
} from 'd3-selection'
import "../../scss/components/tooltip.scss"

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];



export default function tooltip(bounds, chartGroup, data, yAccessor, dimensions, xScales, yScale) {

  const tooltipLine = chartGroup.append('line').style('display', 'none');



  const focus = chartGroup
    .append('g')
    .attr('class', 'focus')
    .style('display', 'none');

  focus
    .selectAll('.circle')
    .data(data)
    .enter()
    .append('circle')
    .attr('r', 4)
    .attr('class', 'circle')
    .attr('stroke-width', 2)
    .attr('stroke', 'white')


  const tooltip = select("body")
    .append('div')
    .attr('class', 'g-tooltip')
    .style('display', 'none');

  chartGroup
    .append('rect')
    .attr('class', 'overlay')
    .attr('width', dimensions.boundedWidth)
    .attr('height', dimensions.boundedHeight)
    .style('opacity', 0)
    .on("mouseover", function() {
      focus.style("display", null)
      tooltip.style("display", null)
      tooltipLine.style("display", null)
    })
    .on("mouseout", function() {
      focus.style("display", "none")
      tooltip.style("display", "none")
      tooltipLine.style("display", "none")
    })
    .on('mousemove', mousemove);


  function mousemove(event) {

    const bisect = bisector(d => d.x).left;
    const xPos = pointer(event)[0];

    let locations = []

    data.forEach(series => {
      const x0 = bisect(series.points, xScales[`scale${series.year}`].invert(xPos));
      const d0 = series.points[x0];
      locations.push(d0)
    })

    if (locations[0]) {

      locations.sort((a, b) => b.x.getFullYear() - a.x.getFullYear())

      let tooltipContent = ''
      tooltipContent += `<h4>${months[locations[3].x.getMonth()]} ${locations[3].x.getDate()}</h4>`

      locations.forEach((l, i) => {
        tooltipContent += l.y ? `<div class='${i ? 'row ' : 'row current'}'>${l.x.getFullYear()}: ${l.y}</div>` : ''
      })

      focus
        .selectAll('.circle')
        .data(locations)
        .attr('transform', l => {
          if (l == null) {
            return ('translate(0, 0)')
          } else {
            return (`translate(${xScales['scale' + l.x.getFullYear()](l.x)},${l.y ? yScale(l.y) : yScale(0)})`)
          }
        })
        .style("visibility", l => l && l.y ? "visible" : "hidden")

      tooltipLine.attr('stroke', '#ddd')
        .attr('id', "tooltipLine")
        .attr('x1', xScales['scale2017'](locations[locations.length - 1].x))
        .attr('x2', xScales['scale2017'](locations[locations.length - 1].x))
        .attr('y1', 0)
        .attr('y2', dimensions.boundedHeight);

      let shift = event.pageX < window.innerWidth / 2 ? 20 : 120

      tooltip
        .html(tooltipContent)
        .style("left", (event.pageX - shift) + "px")
        .style("top", (event.pageY - ((locations.filter(l => l.y).length + 2) * 20)) + "px");
    }









  }


}
