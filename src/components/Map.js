import React from "react";
import ReactDOM from "react-dom";
import mapboxgl from "mapbox-gl";
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';
import Polyline from "@mapbox/polyline";
import { tsNumberKeyword } from "@babel/types";
import Style from "./common/Style"
import trafficLayers from "./common/trafficLayers"
import weatherSymbols from "./common/WeatherSymbols"

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
    function GetWeather(geojson){
      if(geojson.coordinates.length > 30){
        var r = Math.round((geojson.coordinates.length / 2) -1);
        for(var i = 0; i < geojson.coordinates.length; i += r){
          if(geojson.coordinates[i] !== undefined)
          {
            GetCurrentWeatherConditions(geojson.coordinates[i][0], geojson.coordinates[i][1]);
          }
        }
      }
      else{
        GetCurrentWeatherConditions(geojson.coordinates[0][0], geojson.coordinates[0][1]);
      }
    }

    function GetRandomWeather(){
      let r = Math.random();   
      let d = new Date(+(new Date()) - Math.floor(Math.random()*10000000)).toLocaleTimeString()

      if(r >= 0 && r < 0.3) {
        return '<div>🌨️ -3°C</div><span>Senast plogat: ' + d + '</span>';
      }
      else if(r >= 0.3 && r < 0.6 ){
        return '<div>🌨️ -5°C</div><span>Senast plogat: ' + d + '</span>';
      }
      else{
        return '<div>☀️ -7°C</div><br><span>Senast plogat: ' + d + '</span>';
      }
    }

    function GetCurrentWeatherConditions(lat, lng){
      console.log(lat, lng);

      let w = GetRandomWeather();
      var popup = new mapboxgl.Popup({closeOnClick: true})
          .setLngLat([lat, lng])
          .setHTML(w)
          .addTo(map);
     // var baseUrl = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lng + "&appid=ad6c112c3abc72584d46eee71285a4aa";

      /*fetch(baseUrl)
      .then(res => res.json())
      .then(
        (result) => {
          try{
          let temp = Math.round(result.main.temp - 272.15);
          console.log(result);
          var test = weatherSymbols[result.weather[0].id];
          var popup = new mapboxgl.Popup({closeOnClick: true})
          .setLngLat([lat, lng])
          .setHTML('<div>' + test[2] + ' ' + temp +  '°C</div>')
          .addTo(map);
        }
        catch{
          console.log("Vi skippar väder här :)");
          
        }
        },
        (error) => {
          console.log(error);
        }
      )*/
    }

    function PlowDragon(geoJSON){
        //var marker = new mapboxgl.Marker();
        //equestAnimationFrame(animateMarker);
    }

    /*function animateMarker(timestamp) {
      var radius = 20;
       
      // Update the data to a new position based on the animation timestamp. The
      // divisor in the expression `timestamp / 1000` controls the animation speed.
      marker.setLngLat([
      Math.cos(timestamp / 1000) * radius,
      Math.sin(timestamp / 1000) * radius
      ]);
       
      // Ensure it's added to the map. This is safe to call if it's already added.
      marker.addTo(map);
       
      // Request the next frame of the animation.
      requestAnimationFrame(animateMarker);
      }*/

    function GetPlowsOnRoute(map, geoJSON) {
      var xhr = new XMLHttpRequest();

      xhr.addEventListener('load', () => {
        AnimatePlowAlongRoute("", JSON.parse(xhr.responseText));
      });

      xhr.addEventListener('error', () => {
        console.log("error event");
        MockBackend();
      });

      // TODO: Will update to a public route later...
      xhr.open('POST', 'https://localhost:5001/plowlocation');
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(JSON.stringify(geoJSON));
    }

    function MockBackend() {
      var obj = {
        "id": "e00c0317-300d-4ded-b159-06c1983a3c3e",
        "origin": [15.53845,60.51195],
        "destination": [15.54487,60.52141], 
        "coordinates": [[15.53845,60.51195],[15.54096,60.513],[15.54168,60.51329],[15.542,60.51343],[15.5427,60.51374],[15.54409,60.51431],[15.544,60.51436],[15.54393,60.51441],[15.54384,60.51451],[15.54382,60.51464],[15.54382,60.51474],[15.54386,60.51483],[15.54393,60.51492],[15.54408,60.51501],[15.54425,60.51508],[15.54457,60.51518],[15.54452,60.5153],[15.54445,60.51549],[15.54473,60.51554],[15.5451,60.51561],[15.54534,60.51566],[15.54584,60.51584],[15.54659,60.51615],[15.54709,60.51636],[15.54756,60.51659],[15.5478,60.51673],[15.54812,60.51695],[15.54853,60.51723],[15.54895,60.5175],[15.54912,60.51763],[15.54921,60.51776],[15.54924,60.5179],[15.5492,60.51803],[15.54913,60.51814],[15.549,60.51825],[15.54858,60.51856],[15.548,60.51902],[15.54736,60.51952],[15.54687,60.5199],[15.54637,60.52024],[15.546,60.52048],[15.54584,60.52058],[15.54569,60.52067],[15.54556,60.52076],[15.54546,60.52083],[15.54537,60.52092],[15.54531,60.52101],[15.54524,60.52112],[15.54519,60.52121],[15.5451,60.52129],[15.54501,60.52135],[15.54487,60.52141]],
        "speedInKmh": 68
        };

      AnimatePlowAlongRoute(map, obj);
    }
    
 
      function animateMarker(geoJSON) {

        setTimeout(() => {
          if(geoJSON !== undefined && PLOWCOUNTER < geoJSON.length)
          {
            var i = PLOWCOUNTER;
            // Update the data to a new position based on the animation timestamp. The
            // divisor in the expression `timestamp / 1000` controls the animation speed.
            
            marker.setLngLat(geoJSON[i]);
            
            ++PLOWCOUNTER;
            // Ensure it's added to the map. This is safe to call if it's already added.
            marker.addTo(map);
            
            // Request the next frame of the animation.
            requestAnimationFrame(function (){animateMarker(geoJSON)});
            
          }
          else{
            PLOWCOUNTER = 0;
            requestAnimationFrame(function (){animateMarker(geoJSON)});
          }
        }, 1000);
      }
 


    function AnimatePlowAlongRoute(map, obj) {
      // TODO. Plot the plow here
      // https://docs.mapbox.com/mapbox-gl-js/example/animate-point-along-route/
      // Calculate number of steps depending on speed

      console.log(obj);
      // Start the animation.
      requestAnimationFrame(function (){animateMarker(obj.coordinates)});

      
      /*var origin = [obj.origin];
      var destination = [obj.destination];

      var route = {
          "type": "FeatureCollection",
          "features": [{
          "type": "Feature",
          "geometry": {
          "type": "LineString",
          "coordinates": [
          origin,
          destination
          ]
          }
        }]
      };
      var point = {
          "type": "FeatureCollection",
          "features": [{
          "type": "Feature",
          "properties": {},
          "geometry": {
          "type": "Point",
          "coordinates": origin
          }
        }]
      };
      // Calculate the distance in kilometers between route start/end point.
      console.log(route.features[0]);
      var steps = 500;
      map.addSource('point', {
        "type": "geojson",
        "data": point
        });
        map.addLayer({
          "id": "point",
          "type": "circle",
          "source": "point",
          "paint": {
          "circle-radius": 1000,
          "circle-color": "#3887be"
          }
          });*/
        /*map.addLayer({
          "id": "point",
          "source": "point",
          "type": "symbol",
          "layout": {
          "icon-image": "airport-15",
          "icon-rotate": ["get", "bearing"],
          "icon-rotation-alignment": "map",
          "icon-allow-overlap": true,
          "icon-ignore-placement": true
          }
          });*/

      //animate(obj, point, route, 0, 1);
    }

    function animate(obj, point, route, counter, steps) {

      point.features[0].geometry.coordinates = route.features[0].geometry.coordinates[counter];
      map.getSource('point').setData(point);

      if (counter < steps) {
        counter++;
        requestAnimationFrame(function(){animate(obj, point, route, counter, steps)});
      }

    }

    const map = new mapboxgl.Map({
      container: this.mapContainer,
      style: "mapbox://styles/mmorsell/ck2xg0hf21ow41dtdntnyp410",
      center: [this.state.lng, this.state.lat],
      zoom: this.state.zoom
    });

    const marker = new mapboxgl.Marker();
    var PLOWCOUNTER = 0;

    var directions = new MapboxDirections({
      styles: Style,
      accessToken: mapboxgl.accessToken,
      unit: "metric",
      placeholderOrigin: 'Välj startplats',
      placeholderDestination: 'Välj ankomstplats',
      language: "sv",
      congestion:true,
      alternatives:true,

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

    map.on('load', function(){

        map.addSource('trafficSource', {
            type: 'vector',
            url: 'mapbox://mapbox.mapbox-traffic-v1'
        });
    
        addTraffic();
        // addIcons();
    });

    function addTraffic(){
        var firstPOILabel = map.getStyle().layers.filter(function(obj){ 
            return obj["source-layer"] == "poi_label";
        });
    
        for(var i = 0; i < trafficLayers.length; i++) {
            // console.log(trafficLayers[i]);
            // console.log(firstPOILabel[0].id);
            let layer = trafficLayers[i];
            // layer.paint["line-color"] = "hsl(45, 90%, 50%)"
            // layer.paint.line-color = "hsl(100, 70%, 45%)";
            map.addLayer(layer, firstPOILabel[0].id);
        }
    }
    // function addIcons() {
        
    //     map.addLayer(SnowPlowIcons);
    // }

    directions.on("route", (data) => {
      if (data.route.length >= 0) {
        for(var i = 0; i < data.route.length; i++) {
            const route = data.route[i];
            const geoJSON = Polyline.toGeoJSON(route.geometry);
        
            if (i == 1) {
              GetPlowsOnRoute(map, geoJSON);
            }

            GetWeather(geoJSON);
      }}
    });

    // When a click event occurs on a feature in the places layer, open a popup at the
// location of the feature, with description HTML from its properties.
map.on('click', 'places', function (e) {
    var coordinates = e.features[0].geometry.coordinates.slice();
    var description = e.features[0].properties.description;
     
    // Ensure that if the map is zoomed out such that multiple
    // copies of the feature are visible, the popup appears
    // over the copy being pointed to.
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }
     
    new mapboxgl.Popup()
    .setLngLat(coordinates)
    .setHTML(description)
    .addTo(map);
    });
     
    // Change the cursor to a pointer when the mouse is over the places layer.
    map.on('mouseenter', 'places', function () {
    map.getCanvas().style.cursor = 'pointer';
    });
     
    // Change it back to a pointer when it leaves.
    map.on('mouseleave', 'places', function () {
    map.getCanvas().style.cursor = '';
    });

  }

  render() {
    return (
      <div>
        <div className="sidebarStyle">
        </div>
        <div ref={el => (this.mapContainer = el)} className="mapContainer" />
      </div>
    );
  }
}
export default Map;

