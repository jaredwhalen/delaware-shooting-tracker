import React, {Component} from "react"
import "../../scss/components/Silhouettes.scss"
// import Tippy from '@tippyjs/react';
// import 'tippy.js/dist/tippy.css'; // optional
import setHeadline from "../util/setHeadline.js"

class Silhouettes extends Component {

  setLetter(demo) {
    let letterArrays = {
      man_items: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"],
      woman_items: ["M", "N", "O", "P", "Q", "R", "S"],
      male_teen_items: ["T", "U", "V"],
      female_teen_items: ["W"],
      boy_items: ["X", "Y", "Z", "a", "b", "d", "e"],
      girl_items: ["f", "g", "h"]
    }

    let randomLetter = arr => arr[Math.floor(Math.random() * arr.length)]

    switch (demo) {
      case "man":
      case "male victim":
      case "victim":
        return randomLetter(letterArrays.man_items)
        break;
      case "woman":
      case "female victim":
        return randomLetter(letterArrays.woman_items)
        break;
      case "male teenager":
      case "teenager":
        return randomLetter(letterArrays.male_teen_items)
        break;
      case "female teenager":
        return randomLetter(letterArrays.female_teen_items)
        break;
      case "boy":
        return randomLetter(letterArrays.boy_items)
        break;
      case "girl":
        return randomLetter(letterArrays.girl_items)
        break;
      default:
    }
  }

  render() {

    setHeadline(this.props.data)

    const silhouetteComponents = this.props.data.map((obj, i) => {
      let highlight = obj.homicide === "yes" && obj.first_name && obj.last_name
      return(
          <div
            key={`${obj.incident_id}-${i}`}
            data-age={`${obj.age ? obj.age : 'undefined'}`}
            data-gender={`${obj.gender ? obj.gender : 'undefined'}`}
            className={`item noclick g-icon people ${highlight ? "highlight" : ""} ${obj.gender} ${obj.homicide === "yes" ? "homicide" : ""}`}
            style={{letterSpacing:`${ Math.floor(Math.floor(Math.random() * (15 - 8 + 1)) + 8) * -1 }px`}}
          >
          {this.setLetter(obj.demo)}
          {highlight ?
          (
            <div className='highlight-box'>
              <div className='h-text'>
                <div className='h-text-main'>{obj.first_name} {obj.last_name}</div>
                <div className='h-text-accent'>Killed{obj.age ? <> at {obj.age}</> : ''}</div>
              </div>
            </div>
          )
            :
            ``
          }
          </div>
      )
    })



    return (<div id="g-victims-topper">
              <div id="g-victims-topper-wrapper">
                {silhouetteComponents}
              </div>
            </div>)
  }
}

export default Silhouettes
