import React from "react";
import ReactDOM from "react-dom";
import mapboxgl from "mapbox-gl";
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';

mapboxgl.accessToken =
  "pk.eyJ1IjoibW1vcnNlbGwiLCJhIjoiY2syeGZwOXFhMG55eTNjbHFpYjVrbngyMCJ9.eg9D5CWK4Ovb1lYVbGcg3A";

class Application extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lng: 15.6360,
      lat: 60.5053,
      zoom: 9
    };
  }


  componentDidMount() {
    

    const map = new mapboxgl.Map({
      container: this.mapContainer,
      style: "mapbox://styles/mmorsell/ck2xg0hf21ow41dtdntnyp410",
      center: [this.state.lng, this.state.lat],
      zoom: this.state.zoom
    });

    var directions = new MapboxDirections({
      accessToken: mapboxgl.accessToken,
      unit: "metric",
      placeholderOrigin: 'Välj startplats',
      placeholderDestination: 'Välj ankomstplats',

      controls: {
        profileSwitcher: false,
        inputs: true,
        instructions: true
      },
    });

    map.addControl(directions, "top-left");
    // let bounds = [[17.5695, 61.5578], [17.5695, 61.5578]];
    // map.setMaxBounds(bounds);
    let canvas = map.getCanvasContainer();
    let start = [15.6254, 60.5519];

    function getRoute(end) {
      let start = [15.6254, 60.5519];
      let url = 'https://api.mapbox.com/directions/v5/mapbox/driving-traffic/' + start[0] + ',' + start[1] + ';' + end[0] + ',' + end[1] + '?steps=true&geometries=geojson&access_token=' + mapboxgl.accessToken;
    
      // make an XHR request https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest
      let req = new XMLHttpRequest();
      req.responseType = 'json';
      req.open('GET', url, true);
      req.onload = function() {
        let data = req.response.routes[0];
        let route = data.geometry.coordinates;
        let geojson = {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: route
          }
        };
        // if the route already exists on the map, reset it using setData
        if (map.getSource('route')) {
          map.getSource('route').setData(geojson);
        } else { // otherwise, make a new request
          map.addLayer({
            id: 'route',
            type: 'line',
            source: {
              type: 'geojson',
              data: {
                type: 'Feature',
                properties: {},
                geometry: {
                  type: 'LineString',
                  coordinates: geojson
                }
              }
            },
            layout: {
              'line-join': 'round',
              'line-cap': 'round'
            },
            paint: {
              'line-color': '#3887be',
              'line-width': 5,
              'line-opacity': 0.75
            }
          });
        }
        // add turn instructions here at the end
      };
      req.send();
    }


    map.on('click', function(e) {
      let coordsObj = e.lngLat;
      canvas.style.cursor = '';
      let coords = Object.keys(coordsObj).map(function(key) {
        return coordsObj[key];
      });
      let end = {
        type: 'FeatureCollection',
        features: [{
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Point',
            coordinates: coords
          }
        }
        ]
      };
      if (map.getLayer('end')) {
        map.getSource('end').setData(end);
      } else {
        map.addLayer({
          id: 'end',
          type: 'circle',
          source: {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: [{
                type: 'Feature',
                properties: {},
                geometry: {
                  type: 'Point',
                  coordinates: coords
                }
              }]
            }
          },
          paint: {
            'circle-radius': 10,
            'circle-color': '#f30'
          }
        });
      }
      getRoute(coords);
    });


    map.on("move", () => {
      this.setState({
        lng: map.getCenter().lng.toFixed(4),
        lat: map.getCenter().lat.toFixed(4),
        zoom: map.getZoom().toFixed(2)
      });
    });

    map.on('load', function() {
      // make an initial directions request that
      // starts and ends at the same location
      getRoute(start);
    
      // Add starting point to the map
      map.addLayer({
        id: 'point',
        type: 'circle',
        source: {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [{
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'Point',
                coordinates: start
              }
            }
            ]
          }
        },
        paint: {
          'circle-radius': 10,
          'circle-color': '#ffffff'
        }
      });
      // this is where the code from the next step will go
    });

  }

  render() {
    return (
      <div>
        <div className="sidebarStyle">
          <div>
            Longitude: {this.state.lng} | Latitude: {this.state.lat} | Zoom:{" "}
            {this.state.zoom}
          </div>
        </div>
        <div ref={el => (this.mapContainer = el)} className="mapContainer" />
      </div>
    );
  }
}

ReactDOM.render(<Application />, document.getElementById("app"));
