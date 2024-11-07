import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExternalLinkAlt} from '@fortawesome/free-solid-svg-icons'
import convert24HourTimeToStandard from "../util/convert24HourTimeToStandard.js"
import isPlural from "../util/isPlural.js"
import "../../scss/components/Card.scss"

function Card(props) {

  const {container, incident, wounded, killed, mostRecent} = props;

  let {incident_id, date, time, headline, city, location, officer_involved, narrative, story_url} = incident[0]

  return(
    <div className={`${container}-card g-card`} key={`${container}-card-${incident_id}`}>
      {(incident_id === mostRecent && container === "g-table")  && <div className="g-header">Most recent</div>}
      <div className="g-card-inner">
        <div className="g-datetime">{date} {time ? " • " + convert24HourTimeToStandard(time) : ""}</div>
        <h3 className="g-heading">{headline ? headline : `${officer_involved == "yes" ? 'Officer-involved shooting' : 'Shooting'} in ${city} leaves ${wounded > 0 ? `${wounded} wounded` : ''}${wounded > 0 && killed > 0 ? ', ': ''}${killed > 0 ? `${killed} dead` : ''}`} </h3>
        <div className="g-location">{location}{location && city ? ', ' : ''}{city}</div>
        {(narrative && container === "g-table") && <div className="g-narrative">{narrative.match(/[^\r\n]+/g).map(p => <p className="g-p-project">{p}</p>)}</div>}
        {story_url && <div className="g-storyUrl"><a target="_blank" href={story_url}><FontAwesomeIcon icon={faExternalLinkAlt}/>  Read our coverage</a></div>}
      </div>
      {(container === "g-table") ? (
        <div className="g-footer">
          <h5 className="g-instruction">Victims</h5>
          <ul>
          {incident
            .sort((a, b) => {
              return b.homicide.localeCompare(a.homicide)|| a.age - b.age
            })
            .map(v => (
            <li>
              {(v.first_name && v.last_name) ? <>{v.first_name} {v.last_name}</> : <>An unidentified {v.demo}</>}
              {v.age ? <>,  {v.homicide === 'yes' ? <>killed at </> : ''}{v.age}</> : ''}
            </li>
            )
          )}
          </ul>
        </div>
      ) : ''}

    </div>
  )
}

export default React.memo(Card);
