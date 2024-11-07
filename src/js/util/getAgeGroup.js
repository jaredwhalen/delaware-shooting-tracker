// export default function getAgeGroup(age) {
//   switch(true) {
//     case typeof age !== "number":
//       return "Unknown"
//       break;
//     case age <= 12:
//       return "0 - 12"
//       break;
//     case age >= 13 && age <= 18:
//       return "13 - 18"
//       break;
//     case age >= 19 && age <= 29:
//       return "19 - 29"
//       break;
//     case age >= 29 && age <= 39:
//       return "29 - 39"
//       break;
//     case age >= 39 && age <= 49:
//       return "39 - 49"
//       break;
//     case age >= 49 && age <= 59:
//       return "49 - 59"
//     case age >= 60:
//       return "60+"
//       break;
//     default:
//       return "Unknown"
//   }
// }
export default function getAgeGroup(age) {
  switch(true) {
    case typeof age == undefined:
      return "Unknown"
      break;
    case age < 18:
      return "17 and under"
      break;
    case age >= 18 && age <= 29:
      return "18 to 29"
    case age >= 30 && age <= 44:
      return "30 to 44"
    case age >= 45:
      return "45 and up"
      break;
    default:
      return "Unknown"
  }
}
