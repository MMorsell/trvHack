import React from "react";
import ReactDOM from "react-dom";
import mapboxgl from "mapbox-gl";
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';

mapboxgl.accessToken =
  "pk.eyJ1IjoibW1vcnNlbGwiLCJhIjoiY2syeGZwOXFhMG55eTNjbHFpYjVrbngyMCJ9.eg9D5CWK4Ovb1lYVbGcg3A";

class Map extends React.Component {
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
      language: "sv",

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


    map.on("move", () => {
      this.setState({
        lng: map.getCenter().lng.toFixed(4),
        lat: map.getCenter().lat.toFixed(4),
        zoom: map.getZoom().toFixed(2)
      });
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
export default Map;

