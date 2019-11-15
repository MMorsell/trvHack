import React from "react";
import ReactDOM from "react-dom";
import mapboxgl from "mapbox-gl";
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';
import Polyline from "@mapbox/polyline";

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
    
    var weatherSymbols = {"200":["200","thunderstorm with light rain","",1],"201":["201","thunderstorm with rain","",2],"202":["202","thunderstorm with heavy rain","",3],"210":["210","light thunderstorm","",1],"211":["211","thunderstorm","",2],"212":["212","heavy thunderstorm","",3],"221":["221","ragged thunderstorm","",2],"230":["230","thunderstorm with light drizzle","",1],"231":["231","thunderstorm with drizzle","",1],"232":["232","thunderstorm with heavy drizzle","",2],"300":["300","light intensity drizzle","",1],"301":["301","drizzle","",1],"302":["302","heavy intensity drizzle","",2],"310":["310","light intensity drizzle rain","",1],"311":["311","drizzle rain","",1],"312":["312","heavy intensity drizzle rain","",2],"313":["313","shower rain and drizzle","",2],"314":["314","heavy shower rain and drizzle","",2],"321":["321","shower drizzle","",1],"500":["500","light rain","",1],"501":["501","moderate rain","",2],"502":["502","heavy intensity rain","",2],"503":["503","very heavy rain","",3],"504":["504","extreme rain","",3],"511":["511","freezing rain","",2],"520":["520","light intensity shower rain","",1],"521":["521","shower rain","",2],"522":["522","heavy intensity shower rain","",3],"531":["531","ragged shower rain","",2],"600":["600","light snow","",1],"601":["601","snow","",2],"602":["602","heavy snow","",3],"611":["611","sleet","",2],"612":["612","shower sleet","",2],"615":["615","light rain and snow","",1],"616":["616","rain and snow","",2],"620":["620","light shower snow","",1],"621":["621","shower snow","",2],"622":["622","heavy shower snow","",3],"701":["701","mist","",1],"711":["711","smoke","",2],"721":["721","haze","",1],"731":["731","sand, dust whirls","",2],"741":["741","fog","",2],"751":["751","sand","",1],"761":["761","dust","",1],"762":["762","volcanic ash","",2],"771":["771","squalls","",3],"781":["781","tornado","",3],"800":["800","clear sky","",0],"801":["801","few clouds","",0],"802":["802","scattered clouds","",0],"803":["803","broken clouds","",0],"804":["804","overcast clouds","",0],"900":["900","tornado",3],"901":["901","tropical storm",3],"902":["902","hurricane",3],"903":["903","cold",3],"904":["904","hot",3],"905":["905","windy",3],"906":["906","hail",3],"951":["951","calm",0],"952":["952","light breeze ",0],"953":["953","gentle breeze",0],"954":["954","moderate breeze",0],"955":["955","fresh breeze",0],"956":["956","strong breeze",0],"957":["957","high wind, near gale",1],"958":["958","gale",2],"959":["959","severe gale",2],"960":["960","storm ",2],"961":["961","violent storm ",3],"962":["962","hurricane ",3]};

    function GetWeather(geojson){
      for(var i = 0; i < geojson.coordinates.length; i += 100){
        if(geojson.coordinates[i] !== undefined)
        {
          GetCurrentWeatherConditions(geojson.coordinates[i][0], geojson.coordinates[i][1]);
        }
      }
    }

    function GetCurrentWeatherConditions(lat, lng){
      console.log(lat, lng);
      var baseUrl = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lng + "&appid=ad6c112c3abc72584d46eee71285a4aa";

      fetch(baseUrl)
      .then(res => res.json())
      .then(
        (result) => {
          // debugger
          console.log(result);
          var test = weatherSymbols[result.weather[0].id];
          var popup = new mapboxgl.Popup({closeOnClick: true})
          .setLngLat([lat, lng])
          .setHTML('<div>' + test + '</div>')
          .addTo(map);
        },
        (error) => {
          console.log(error);
        }
      )
    }

    function GetPlowsOnRoute(geoJSON) {
      var xhr = new XMLHttpRequest();

      xhr.addEventListener('load', () => {
        console.log(xhr.responseText);
      });
      // TODO: Will update to a public route later...
      xhr.open('POST', 'https://localhost:5001/plowlocation');
      xhr.send(geoJSON);
    }

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
      alternatives: true,

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

    directions.on("route", (data) => {
      if (data.route.length >= 0) {
        const route = data.route[0];
        const geoJSON = Polyline.toGeoJSON(route.geometry);
        
        GetWeather(geoJSON);
        GetPlowsOnRoute(geoJSON);
      }
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

