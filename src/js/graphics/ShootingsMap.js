import React, {Component} from 'react';
import ReactMapboxGl, {ZoomControl} from 'react-mapbox-gl';
import Geocoder from "react-map-gl-geocoder";

import {ReactMapboxGlCluster} from 'react-mapbox-gl-cluster';
import {featureCollection, point} from '@turf/helpers'
import "mapbox-gl/dist/mapbox-gl.css"
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css"

// import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css"

const TOKEN = 'pk.eyJ1IjoiamFyZWQtd2hhbGVuIiwiYSI6ImNrMm5sMzNqYTB0dXMzY3FlZTBuaXBxenIifQ.m21qGljLeU7ZZOm4FEEcmg'

const Map = ReactMapboxGl({
  accessToken: TOKEN,
});


const mapProps = {
  center: [-75.5258646, 39.508569],
  zoom: [9],
  style:'mapbox://styles/jared-whalen/ck5zrdq633ep91in63izudbal',
  containerStyle:{
    height: '500px',
    width: '100%'
  },
  scrollZoom: false,
  dragRotate: false
};

class ShootingsMap extends Component {

  getEventHandlers() {
    return {
      onClick: (properties, coords, offset) =>
        console.log(`Receive event onClick at properties: ${properties}, coords: ${coords}, offset: ${offset}`),
      onMouseEnter: (properties, coords, offset) =>
        console.log(`Receive event onMouseEnter at properties: ${properties}, coords: ${coords}, offset: ${offset}`),
      onMouseLeave: (properties, coords, offset) =>
        console.log(`Receive event onMouseLeave at properties: ${properties}, coords: ${coords}, offset: ${offset}`),
      onClusterClick: (properties, coords, offset) =>
        console.log(`Receive event onClusterClick at properties: ${properties}, coords: ${coords}, offset: ${offset}`),
    };
  }




  render() {

    const features = featureCollection(this.props.data.filter(d => d.year == 2021).map(d => point([d.longitude, d.latitude])))

    // featureCollection();

    return (
        <Map
          {...mapProps}
            onViewportChange={this.handleViewportChange}
          >
            <ReactMapboxGlCluster data={features} {...this.getEventHandlers()} />
            <ZoomControl/>
        </Map>
    );
  }
}

export default ShootingsMap
