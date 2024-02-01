"use client";

import * as React from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import curves from "../../../../public/bt_curves.json";
import slopes from "../../../../public/bt_slopes.json";
import ls from "../../../../public/ls.png";
import curve from "../../../../public/curve.png";
import dotenv from "dotenv";
import { Spinner } from "@chakra-ui/react";

dotenv.config();

const MAP_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAP_ACCESS_TOKEN;

const MAP_STYLE = "mapbox://styles/mapbox/outdoors-v12?optimize=true";

function MapboxMap() {
  // this is where the map instance will be stored after initialization
  const [map, setMap] = React.useState<mapboxgl.Map>();
  const [loading, setLoading] = React.useState(true);

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

    mapboxMap.on("style.load", () => {
      if (typeof window === "undefined" || node === null) return;

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

    // map.loadImage(myImage, (error, image) => {
    //   if (error) throw error;
    //   map.addImage('image-name', image);
    //   });

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
                properties: {
                  title: "",
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
        setMap(mapboxMap);
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
                properties: {
                  title: "",
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
        setMap(mapboxMap);
      }
    );

    setMap(mapboxMap);

    return () => {
      mapboxMap.remove();
    };
  }, []);

  React.useEffect(() => {
    const alreadyLoaded = localStorage.getItem("alreadyLoaded");
    if (alreadyLoaded !== "true") {
      localStorage.setItem("alreadyLoaded", "true");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  }, []);

  return <div ref={mapNode} style={{ width: "100%", height: "100%" }} />;
}

export default MapboxMap;
