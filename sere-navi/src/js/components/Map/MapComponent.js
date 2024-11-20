import React, { useRef, useEffect, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const MapComponent = ({ currentPosition }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const marker = useRef(null);
  const [mapState, setMapState] = useState({ lat: 33.5676, lon: 130.4102, zoom: 9 });

  useEffect(() => {
    if (map.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      center: [mapState.lon, mapState.lat],
      zoom: mapState.zoom,
      style: {
        version: 8,
        sources: {
          "osm": {
            type: "raster",
            tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
            tileSize: 256,
            attribution: '© <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
          }
        },
        layers: [
          {
            id: "osm-tiles",
            type: "raster",
            source: "osm",
            minzoom: 0,
            maxzoom: 19,
          }
        ]
      }
    });

    map.current.on('move', () => {
      setMapState({
        lat: Number(map.current.getCenter().lat.toFixed(4)),
        lon: Number(map.current.getCenter().lng.toFixed(4)),
        zoom: Number(map.current.getZoom().toFixed(2))
      });
    });
  }, []);

  useEffect(() => {
    if (!map.current || !currentPosition) return;

    if (marker.current) {
      marker.current.remove();
    }

    marker.current = new maplibregl.Marker()
    .setLngLat([currentPosition.longitude, currentPosition.latitude])
    .addTo(map.current);

    map.current.flyTo({
      center: [currentPosition.longitude, currentPosition.latitude],
      zoom: 14
    });
  }, [currentPosition]);

  return (
    <div ref={mapContainer} className="map-container" />
  );
};

export default MapComponent;
