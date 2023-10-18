"use client";

import * as React from "react";
import mapboxgl from "mapbox-gl";
import { FeatureCollection } from "geojson";
import "mapbox-gl/dist/mapbox-gl.css";
import curves from "/Users/wangdrakdorji/Desktop/heruka/gari/gari/public/bt_curves.json";
import slopes from "/Users/wangdrakdorji/Desktop/heruka/gari/gari/public/bt_slopes.json";
import OpenWeatherAPI from "openweather-api-node";

const OPEN_WEATHER_API_KEY = "d76c019b0abe496ddafd4972749b4177";
const MAP_ACCESS_TOKEN =
  "pk.eyJ1Ijoid2RvcmppIiwiYSI6ImNsbGxnMzVkYzE3cGEzZHBmbTYxMDIzM3MifQ.qsQvGnT8BnGbcCDkxakeyQ";
const MAP_STYLE = "mapbox://styles/mapbox/outdoors-v12?optimize=true";

interface sidebarStats {
  temperature: number;
  weatherDescp: string;
  humidity: number;
  rain: number;
  snow: number;
  cloudiness: number;
  visibility: number;
}

function MapboxMap() {
  // this is where the map instance will be stored after initialization
  const [map, setMap] = React.useState<mapboxgl.Map>();
  const [userStats, setStats] = React.useState<sidebarStats>({
    temperature: 0,
    weatherDescp: "not loaded",
    humidity: 0,
    rain: 0,
    snow: 0,
    cloudiness: 0,
    visibility: 0,
  });

  const [curLat, setLat] = React.useState(27.484506705905304);
  const [curLong, setLong] = React.useState(90.17388556333793);

  // React ref to store a reference to the DOM node that will be used
  // as a required parameter `container` when initializing the mapbox-gl
  // will contain `null` by default
  const mapNode = React.useRef(null);

  React.useEffect(() => {
    const node = mapNode.current;
    // if the window object is not found, that means
    // the component is rendered on the server
    // or the dom node is not initialized, then return early
    if (typeof window === "undefined" || node === null) return;

    // otherwise, create a map instance
    const mapboxMap = new mapboxgl.Map({
      container: node,
      accessToken: MAP_ACCESS_TOKEN,
      style: MAP_STYLE,
      center: [curLong, curLat],
      zoom: 13.5,
      // dragPan: false,
      pitchWithRotate: false,
      dragRotate: false,
      touchZoomRotate: false,
    });

    const size = 200;

    // This implements `StyleImageInterface`
    // to draw a pulsing dot icon on the map.
    const pulsingDot = {
      width: size,
      height: size,
      data: new Uint8Array(size * size * 4),

      // When the layer is added to the map,
      // get the rendering context for the map canvas.
      onAdd: function () {
        const canvas = document.createElement("canvas");
        canvas.width = this.width;
        canvas.height = this.height;
        this.context = canvas.getContext("2d");
      },

      // Call once before every frame where the icon will be used.
      render: function () {
        const duration = 1000;
        const t = (performance.now() % duration) / duration;

        const radius = (size / 2) * 0.3;
        const outerRadius = (size / 2) * 0.7 * t + radius;
        const context = this.context;

        // Draw the outer circle.
        context.clearRect(0, 0, this.width, this.height);
        context.beginPath();
        context.arc(
          this.width / 2,
          this.height / 2,
          outerRadius,
          0,
          Math.PI * 2
        );
        context.fillStyle = `rgba(0, 255, 255, ${1 - t})`;
        context.fill();

        // Draw the inner circle.
        context.beginPath();
        context.arc(this.width / 2, this.height / 2, radius, 0, Math.PI * 2);
        context.fillStyle = "rgba(0, 255, 255, 1)";
        context.strokeStyle = "white";
        context.lineWidth = 2 + 4 * (1 - t);
        context.fill();
        context.stroke();

        // Update this image's data with data from the canvas.
        this.data = context.getImageData(0, 0, this.width, this.height).data;

        // Continuously repaint the map, resulting
        // in the smooth animation of the dot.
        mapboxMap.triggerRepaint();

        // Return `true` to let the map know that the image was updated.
        return true;
      },
    };

    async function updateUserStats() {
      // navigator.geolocation.getCurrentPosition(function (position) {
      //   setLat(position.coords.latitude);
      //   setLong(position.coords.longitude);
      // });
      let weather = new OpenWeatherAPI({
        key: OPEN_WEATHER_API_KEY,
        coordinates: {
          lat: curLat,
          lon: curLong,
        },
        units: "metric",
      });
      weather.getCurrent().then((data) => {
        setStats({
          temperature: data.weather.temp.cur,
          weatherDescp: data.weather.description,
          visibility: data.weather.visibility,
          rain: data.weather.rain,
          snow: data.weather.snow,
          humidity: data.weather.humidity,
          cloudiness: data.weather.clouds,
        });
      });
    }
    updateUserStats();
    // setInterval(updateUserStats, 10000);

    mapboxMap.on("style.load", () => {
      mapboxMap.addLayer({
        id: "route",
        type: "line",
        source: {
          type: "geojson",
          data: "/bt_roads.json",
        },
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "rgba(255, 103, 0,1)",
          "line-width": 5,
          "line-opacity": 0.75,
        },
      });

      mapboxMap.addSource("mapbox-dem", {
        type: "raster-dem",
        url: "mapbox://mapbox.mapbox-terrain-dem-v1",
        tileSize: 512,
        maxzoom: 14,
      });
      mapboxMap.setTerrain({ source: "mapbox-dem", exaggeration: 1.5 });
    });

    mapboxMap.loadImage(
      "https://i.imgur.com/B9Z9vv9.png",
      (error: any, image: any) => {
        if (error) throw error;
        mapboxMap.addImage("custom-marker", image);
        // Add a GeoJSON source with 2 points
        mapboxMap.addSource("points", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: curves.map((point) => {
              return {
                type: "Feature",
                geometry: {
                  type: "Point",
                  coordinates: [point.long, point.lat],
                },
              };
            }),
          },
        });

        // Add a symbol layer
        mapboxMap.addLayer({
          id: "points",
          type: "symbol",
          source: "points",
          layout: {
            "icon-image": "custom-marker",
            // get the title name from the source's "title" property
            "text-field": ["get", "title"],
            "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
            "text-offset": [0, 1.25],
            "text-anchor": "top",
          },
        });
      }
    );

    mapboxMap.loadImage(
      "https://i.imgur.com/x1ov3LO.png",
      (error: any, image: any) => {
        if (error) throw error;
        mapboxMap.addImage("ls-marker", image);
        // Add a GeoJSON source with 2 points
        mapboxMap.addSource("lspoints", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: slopes.map((point) => {
              return {
                type: "Feature",
                geometry: {
                  type: "Point",
                  coordinates: [point.long, point.lat],
                },
              };
            }),
          },
        });

        // Add a symbol layer
        mapboxMap.addLayer({
          id: "lspoints",
          type: "symbol",
          source: "lspoints",
          layout: {
            "icon-image": "ls-marker",
            // get the title name from the source's "title" property
            "text-field": ["get", "title"],
            "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
            "text-offset": [0, 1.25],
            "text-anchor": "top",
          },
        });

        mapboxMap.addImage("pulsing-dot", pulsingDot, { pixelRatio: 2 });

        mapboxMap.addSource("dot-point", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [
              {
                type: "Feature",
                geometry: {
                  type: "Point",
                  coordinates: [curLong, curLat], // icon position [lng, lat]
                },
              },
            ],
          } as FeatureCollection,
        });

        mapboxMap.addLayer({
          id: "layer-with-pulsing-dot",
          type: "symbol",
          source: "dot-point",
          layout: {
            "icon-image": "pulsing-dot",
          },
        });
      }
    );

    setMap(mapboxMap);

    return () => {
      mapboxMap.remove();
    };
  }, []);

  function openNav() {
    document.getElementById("mySidebar").style.width = "250px";
    document.getElementById("sidebarContent").innerHTML = `

    <h1 style="color: white; font-weight: 900;padding-left: 20px;">${"Area Stats"}</h1>
    <h1 style="color: white; font-weight: 900;"></h1>
    <div class="spacer"></div>

    <div class="sidebar-box">
    <p>Temperature: ${userStats.temperature} \u00B0C</p>
  </div>
  <div class="sidebar-box">
  <p>Visibility: ${Math.round(userStats.visibility / 1000)} \u00B0C</p>
</div>
  <div class="sidebar-box">
    <p>Weather: ${userStats.weatherDescp}</p>
  </div>
  <div class="sidebar-box">
  <p>Humidity: ${userStats.humidity} %</p>
</div>
<div class="sidebar-box">
  <p>Rain: ${userStats.rain} mm</p>
</div>
<div class="sidebar-box">
  <p>Clouds: ${userStats.cloudiness} %</p>
</div>
<div class="sidebar-box">
  <p>Snow ${userStats.snow} mm</p>
</div>

    `;
  }

  function closeNav() {
    document.getElementById("mySidebar").style.width = "0";
  }

  return (
    <>
      <div id="mySidebar" className="sidebar">
        <a className="closebtn" onClick={closeNav}>
          ×
        </a>
        <div id="sidebarContent" className="sidebar-content"></div>
      </div>

      <button className="openbtn" onClick={openNav}>
        ☰
      </button>
      <div ref={mapNode} style={{ width: "100%", height: "80%" }} />
    </>
  );
}

export default MapboxMap;
