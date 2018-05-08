import _ from 'lodash';

export function encodePointCoordinates(coordinatesObj) {
  let geosGeometryTemplate = _.template('POINT(<%= lng %> <%= lat %>)');
  return geosGeometryTemplate(coordinatesObj);
}

export function parsePointCoordinates(geosGeometryCoordinates) {
  return {
    lng: geosGeometryCoordinates[0],
    lat: geosGeometryCoordinates[1]
  };
}