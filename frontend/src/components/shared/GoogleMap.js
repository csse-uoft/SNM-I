/**
 * Use Google Maps in React without custom libraries.
 * Some of the ideas are from
 * https://cuneyt.aliustaoglu.biz/en/using-google-maps-in-react-without-custom-libraries/
 */

import React, { useEffect, useMemo, useState } from 'react';
import { Paper, Typography, Link } from "@mui/material";
import { createRoot } from 'react-dom/client';
import { useNavigate } from "react-router-dom";
import { getInstancesInClass } from "../../api/dynamicFormApi";
import { formatLocation } from '../../helpers/location_helpers';

const Google = window.google || {maps: {}};
const {Map, Marker, InfoWindow, Size} = Google.maps;
let geocoder = new Google.maps.Geocoder();

function ReactInfoWindow({marker, navigate}) {
  const {title, link, content} = marker;
  return (
    <>
      <Link style={{cursor: 'pointer'}} onClick={() => link ? navigate(link) : null}>
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

// Mount a react component into uncontrolled component
const createInfoWindow = (map, markerElement, marker, navigate, idx, addressInfo) => {
  const infoWindow = new InfoWindow({
    content: `<div id="infoWindow-${idx}" />`,
    position: markerElement.position,
    pixelOffset: new Size(0, -42),
  });

  let container = null;
  infoWindow.addListener('domready', e => {
    if (!container) {
      container = document.getElementById(`infoWindow-${idx}`);
      const root = createRoot(container);
      marker.content = formatLocation(marker.position, addressInfo);
      root.render(<ReactInfoWindow navigate={navigate} marker={marker}/>);
    }
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

let GoogleMap;

// Export empty div if no network to load google maps.
if (Map) {
  // Google map in each pages, native Google API implementation
  // (without any react wrapper, library)
  GoogleMap = function (props) {
    const navigate = useNavigate();
    const defaultCenter = useMemo(() => ({lat: 43.6870, lng: -79.4132}), []);
    const [map, setMap] = useState(null);
    const [addressInfo, setAddressInfo] = useState();
    const [zoom, setZoom] = useState(11);
    const [center, setCenter] = useState(defaultCenter);
    const [markers, setMarkers] = useState(props.markers);

    useEffect(() => {
      setMarkers(props.markers);
      setMap(new Map(document.getElementById('map'), {
        center: center,
        zoom: zoom
      }));
    }, [zoom, center, addressInfo, props.markers]);

    useEffect(() => {
      const fetchAddressInfo = async () => {
        const data = {};

        const streetTypes = (await getInstancesInClass('ic:StreetType'));
        const streetDirections = (await getInstancesInClass('ic:StreetDirection'));
        const states = (await getInstancesInClass('schema:State'));
        data.streetTypes = streetTypes;
        data.streetDirections = streetDirections;
        data.states = states;

        setAddressInfo(data);
      }

      fetchAddressInfo();
    }, []);

    useEffect(() => {
      for (let i = 0; i < markers.length; i++) {
        const marker = markers[i];
        let addressText;
        if (!marker.position) {
          continue;
        } else {
          addressText = formatLocation(marker.position, addressInfo);
        }
        if (addressText === '') {
          continue;
        }

        let position;
        geocoder.geocode({'address': addressText}, function(results, status) {
          if (status === Google.maps.GeocoderStatus.OK) {
            const currMarker = new Marker({
              position: results[0].geometry.location,
              map: map,
              title: marker.title,
            });

            // Info window is opened when mouse over the marker.
            // It also stays open after the marker is clicked.
            createInfoWindow(map, currMarker, marker, navigate, i, addressInfo);
          } else {
            alert('Geocode was not successful for the following reason: ' + status);
          }
        });
      }
    }, [map, navigate]);

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
