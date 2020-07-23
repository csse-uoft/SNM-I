/**
 * Use Google Maps in React without custom libraries.
 * Some of the ideas are from
 * https://cuneyt.aliustaoglu.biz/en/using-google-maps-in-react-without-custom-libraries/
 */

import React, { useEffect, useMemo, useState } from 'react';
import { Paper, Typography, Link } from "@material-ui/core";
import { render } from 'react-dom';
import { useHistory } from "react-router-dom";

const Google = window.google || {maps: {}};
const {Map, Marker, InfoWindow, Size} = Google.maps;

// Mount a react component into uncontrolled component
const createInfoWindow = (map, markerElement, marker, history, idx) => {
  const infoWindow = new InfoWindow({
    content: `<div id="infoWindow-${idx}" />`,
    position: marker.position,
    pixelOffset: new Size(0, -42),
  });
  infoWindow.addListener('domready', e => {
    render(
      <ReactInfoWindow history={history} marker={marker}/>,
      document.getElementById(`infoWindow-${idx}`))
  });
  // 'clicked' and 'show' act as an instance variable.
  let clicked = false, show = false;
  document.querySelector(`infoWindow-${idx} button`);
  markerElement.addListener('mouseover', e => {
    infoWindow.open(map);
    show = true;
    markerElement.addListener('mouseout', e => {
      show && !clicked && infoWindow.close();
      if (show) show = false;
    });
    markerElement.addListener('click', e => {
      clicked = true;
      infoWindow.open(map);
    });
    window.google.maps.event.addListener(infoWindow, 'closeclick', e => {
      clicked = false;
    });
  });
  return infoWindow;
};

function ReactInfoWindow({marker, history}) {
  const {title, link, content} = marker;
  return (
    <>
      <Link style={{cursor: 'pointer'}} onClick={() => link ? history.push(link) : null}>
        <Typography>
          {title}
        </Typography>
      </Link>
      <Typography color="textSecondary">
        {content}
      </Typography>
    </>
  );
}

let GoogleMap;

// Export empty div if no network to load google maps.
if (Map) {
  // Google map in each pages, native Google API implementation
  // (without any react wrapper, library)
  GoogleMap = function (props) {
    const history = useHistory();
    const defaultCenter = useMemo(() => ({lat: 43.6870, lng: -79.4132}), []);
    const {
      zoom = 11,
      center = defaultCenter, // Toronto
      markers = [],
    } = props;
    const [map, setMap] = useState(null);

    useEffect(() => {
      setMap(new Map(document.getElementById('map'), {
        center: center,
        zoom: zoom
      }));
    }, [zoom, center]);

    useEffect(() => {
      for (let i = 0; i < markers.length; i++) {
        const marker = markers[i];
        const currMarker = new Marker({
          position: marker.position,
          map: map,
          title: marker.title,
        });
        // Info window is opened when mouse over the marker.
        // It also stays open after the marker is clicked.
        createInfoWindow(map, currMarker, marker, history, i);
      }
    }, [markers, map, history]);

    return useMemo(() =>
        <Paper elevation={5} style={{width: '100%', height: '40vh', marginTop: 5}} id="map"/>
      , []);
  }
} else {
  GoogleMap = function () {
    console.info('Google maps javascript is not loaded. Are you offline?');
    return <Paper elevation={5} style={{width: '100%', height: '40vh', marginTop: 5}}/>
  }
}

export default GoogleMap;
