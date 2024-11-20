import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const MapboxGLJS = () => {
  const mapContainer = useRef(null);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
      center: [0, 0],
      zoom: 2
    });

    return () => map.remove();
  }, []);

  return <div ref={mapContainer} style={{ height: '400px', width: '100%' }} />;
};

export default MapboxGLJS;