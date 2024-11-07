export default function getAgeInterval(age) {
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
  
  if (typeof age !== "number") {

    return "Unknown"
  } else {
    let res = arr.filter(a => {
      let parts = a.replace("+", "").split("-")
      return(age >= Number(parts[0]) && age <= (Number(parts[1]) || 999))
    })[0]
    return(res)
  }
}
