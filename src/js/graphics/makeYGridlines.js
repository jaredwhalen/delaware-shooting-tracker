import { axisLeft } from 'd3-axis'

const makeYGridlines = (bounds, yScale, dimensions) => {
  bounds.append("g")
    .call(axisLeft(yScale).ticks(4)
      .tickSize(-dimensions.boundedWidth)
      .tickFormat("")
    )
    .attr("class", "gridlines")
}

export default makeYGridlines
