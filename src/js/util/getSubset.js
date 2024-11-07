export default function getSubset(data, filter) {

  const getNDate = n => {
    let today = new Date();
    let date = today.setDate(today.getDate() - n);
    return(date)
  }

  let yearAgo = getNDate(365)
  let monthAgo = getNDate(30)
  let weekAgo = getNDate(7)


  if (filter === "year") {
    return data.filter(x => x.datetime > yearAgo)
  } else if (filter === "month") {
    return data.filter(x => x.datetime > monthAgo)
  } else if (filter === "week") {
    return data.filter(x => x.datetime > weekAgo)
  } else {
    return data.filter(x => x.year == filter)
  }
}
