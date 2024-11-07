import React, { useState, useRef, useCallback } from 'react'
import {render} from 'react-dom';
import MapGL, {Source, Layer, Popup, NavigationControl, FullscreenControl} from 'react-map-gl';
import "mapbox-gl/dist/mapbox-gl.css"
import Geocoder from "react-map-gl-geocoder";
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css"
import {featureCollection, point} from '@turf/helpers'
import groupBy from "../util/groupBy.js"
import Card from "./Card.js"
import Pod from '../components/Pod.js'
import "../../scss/components/ClusterMap.scss"
import YearSelect from "../components/YearSelect.js"
import {clusterLayer, clusterCountLayer, unclusteredPointLayer} from './layers';



const MAPBOX_TOKEN = 'pk.eyJ1IjoiamFyZWQtd2hhbGVuIiwiYSI6ImNrMm5sMzNqYTB0dXMzY3FlZTBuaXBxenIifQ.m21qGljLeU7ZZOm4FEEcmg'; // Set your mapbox token here

export default function ClusterMap(props) {

  let [yearFilter, setYearFilter] = useState(new Date().getFullYear() == props.data[0].year ? new Date().getFullYear() : props.data[0].year)

  const onYearChange = e => {
    setYearFilter(e.target.value)
  }



  const [viewport, setViewport] = useState({
    latitude: 39.508569,
    longitude: -75.5258646,
    zoom: 9,
    bearing: 0,
    pitch: 0
  });

  const [popupInfo, setPopupInfo] = useState(null);

  const mapRef = useRef(null);

  const onClick = event => {
    const feature = event.features[0];

    if (feature) {
      if (feature.layer.id === "clusters") {
        const clusterId = feature.properties.cluster_id;
        const mapboxSource = mapRef.current.getMap().getSource('shootings');
        mapboxSource.getClusterExpansionZoom(clusterId, (err, zoom) => {
          if (err) {
            return;
          }

          setViewport({
            ...viewport,
            longitude: feature.geometry.coordinates[0],
            latitude: feature.geometry.coordinates[1],
            zoom,
            transitionDuration: 100
          });
        });

      }
      if (feature.layer.id === "unclustered-point") {
        let incident = feature.properties
        let victimsArr = JSON.parse(incident.victims)

        let wounded = victimsArr.filter(x => x.homicide === "no").length
        let killed = victimsArr.filter(x => x.homicide === "yes").length

        setPopupInfo({...incident, wounded, killed})
      }

    } else {
      setPopupInfo(null)
    }


  };


  const handleViewportChange = useCallback(
    (newViewport) => setViewport(newViewport),
    []
  );


  const handleGeocoderViewportChange = useCallback(
  (newViewport) => {
    const geocoderDefaultOverrides = { transitionDuration: 500 };

    return handleViewportChange({
      ...newViewport,
      ...geocoderDefaultOverrides
    });
  },
  []
);

  let groupByIncident = groupBy(props.data.filter(d => d.year == yearFilter), "incident_id")

  const features = featureCollection(groupByIncident.map(d => point([d[0].longitude, d[0].latitude], {
    incident_id: d[0].incident_id,
    homicide: d.filter(s => s.homicide === "yes").length > 0 ? 'yes': 'no',
    longitude: d[0].longitude,
    latitude: d[0].latitude,
    location: d[0].location,
    city: d[0].city,
    zip: d[0].zip,
    date: d[0].date,
    time: d[0].time,
    datetime: d[0].datetime,
    story_url: d[0].story_url,
    victims: JSON.stringify(d)
  })))


  return (
    <Pod
      id='recent-shootings'
      heading='Mapping gun violence'
    >
      <YearSelect data={props.data} onYearChange={onYearChange}/>

      <div className='g-pod-chart-legend'>
        <div className='g-pod-chart-legend-item'>
          <div className='g-pod-chart-legend-item-symbol circle cluster'></div>Shooting cluster
        </div>
        <div className='g-pod-chart-legend-item'>
          <div className='g-pod-chart-legend-item-symbol circle homicide'></div>Shooting incident with homicide
        </div>
        <div className='g-pod-chart-legend-item'>
          <div className='g-pod-chart-legend-item-symbol circle incident'></div>Shooting incident
        </div>
      </div>

      <MapGL
        {...viewport}
        width="100%"
        height="500px"
        style={{"marginTop": "10px"}}
        mapStyle="mapbox://styles/jared-whalen/ck5zrdq633ep91in63izudbal"
        onViewportChange={setViewport}
        mapboxApiAccessToken={MAPBOX_TOKEN}
        interactiveLayerIds={[clusterLayer.id, unclusteredPointLayer.id]}
        onClick={onClick}
        ref={mapRef}
        dragRotate={false}
      >
        <Source
          id="shootings"
          type="geojson"
          data={features}
          cluster={true}
          clusterMaxZoom={13}
          clusterRadius={40}
          clusterMinPoints={3}
        >
          <Layer {...clusterLayer} />
          <Layer {...clusterCountLayer} />
          <Layer {...unclusteredPointLayer} />
        </Source>

        {popupInfo && (
          <Popup
            tipSize={5}
            anchor="top"
            longitude={popupInfo.longitude}
            latitude={popupInfo.latitude}
            closeOnClick={false}
            onClose={setPopupInfo}
          >
            <Card container='g-popup' incident={[popupInfo]} wounded={popupInfo.wounded} killed={popupInfo.killed} mostRecent={popupInfo.incident_id}/>
          </Popup>
        )}

        <Geocoder
          mapRef={mapRef}
           onViewportChange={handleGeocoderViewportChange}
           mapboxApiAccessToken={MAPBOX_TOKEN}
           position="top-left"
           countries='us'
           bbox={[-75.789,38.4511,-74.9849,39.8394]}
            filter={function (item) {
             return item.context.map(function (i) {
               return (i.id.split('.').shift() === 'region' && i.text === 'Delaware');
             }).reduce(function (acc, cur) {
             return acc || cur;
             });
           }}
        />

        <div style={{position: "absolute", right: 10, top: 10}}>
          <NavigationControl showCompass={false}/>
        </div>

        <div style={{position: "absolute", right: 10, top: 75}}>
          <FullscreenControl />
        </div>




      </MapGL>
    </Pod>
  );
}

export function renderToDom(container) {
  render(<ClusterMap />, container);
}
