import React from "react";
import ReactDOM from "react-dom";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken =
  "pk.eyJ1IjoibW1vcnNlbGwiLCJhIjoiY2syeGZwOXFhMG55eTNjbHFpYjVrbngyMCJ9.eg9D5CWK4Ovb1lYVbGcg3A";

class Application extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lng: 15.437,
      lat: 60.458,
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

ReactDOM.render(<Application />, document.getElementById("app"));
