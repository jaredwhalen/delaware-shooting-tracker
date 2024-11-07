export default function setHeadline(data) {

  let wounded = data.filter(d => d.homicide === "no").length
  let killed = data.filter(d => d.homicide === "yes").length
  let text = `<span class="g-highlight killed">${killed} people have been killed</span> and <span class="g-highlight wounded">${wounded}</span> were wounded by gun violence in Delaware in the past 365 days`
  let el = document.querySelector(".topper__headline")
  if (el) el.innerHTML = `<div id="g-topper-wrapper">${text}</div>`
}
