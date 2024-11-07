export default function setDemo(item) {
  let demo;
  let {age, gender} = item;
  age = age.length ? Number(age) : undefined
  switch (gender) {
    case "Male":
      switch (true) {
        case (age <= 13):
          demo = "boy";
          break;
        case (age >= 13 && age < 18):
          demo = "male teenager";
          break;
        case (age >= 18):
          demo = "man";
          break;
        case (!age):
          demo = "male victim";
          break;
        default:
        // do nothing
      }
    break;
    case "Female":
      switch (true) {
        case (age <= 13):
          demo = "girl";
          break;
        case (age >= 13 && age < 18):
          demo = "female teenager";
          break;
        case (age >= 18):
          demo = "woman";
          break;
        case (!age):
          demo = "female victim";
          break;
        default:
        // do nothing
      }
    break;
    default:
      switch (true) {
        case (age <= 13):
          demo = "child";
          break;
        case (age >= 13 && age < 18):
          demo = "teenager";
          break;
        case (age >= 18 || age === undefined):
          demo = "victim";
          break;
        default:
      }
    break;
  }
  return demo
}
