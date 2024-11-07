export default function getDimensions(width, height) {
  let dimensions = {
    width: width,
    height: height,
    margin: {
      top: 10,
      right: 20,
      bottom: 50,
      left: 50,
    },
  }
  dimensions.boundedWidth = dimensions.width -
    dimensions.margin.left -
    dimensions.margin.right
  dimensions.boundedHeight = dimensions.height -
    dimensions.margin.top -
    dimensions.margin.bottom

  return dimensions
}
