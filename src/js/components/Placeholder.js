import React from "react"
import Pod from './Pod.js'


export default function Placeholder(props) {
  return(
    <Pod
      id='shootings-by-year'
      heading={props.heading}
      chatter={props.chatter}
    >
      <div className="placeholder" >
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <polygon points="0,0 100,100 0,100 100,0 100,100 0,100 0,0 100,0"/>
        Sorry, your browser does not support inline SVG.
        </svg>
      </div>
    </Pod>
)
}
