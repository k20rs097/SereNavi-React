import React, { useRef, useEffect, useState, useCallback } from "react";
import ReactDOM from "react-dom/client";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import MapAnnotation from "./MapAnnotation";
import ApiService from "../../ApiService";

const MapView = ({
  currentPosition,
  startLocation,
  destinationLocation,
  phase,
  routeInformation,
  currentIndex,
  isUserLocationButtonActive,
  setIsUserLocationButtonActive,
  handleLocationSelect,
  setInstructions,
  setTotalDistance,
  handleInitializeRouteInformation,
}) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const currentPositionMarker = useRef(null);
  const destinationMarker = useRef(null);
  const hasFlyToExecuted = useRef(false);
  const currentPositionRef = useRef(currentPosition);

  const [mapState] = useState({
    latitude: 33.5676,
    longitude: 130.4102,
    zoom: 6,
  });

  const initializeMap = useCallback(() => {
    if (map.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      center: [mapState.longitude, mapState.latitude],
      zoom: mapState.zoom,
      style: {
        version: 8,
        sources: {
          osm: {
            type: "raster",
            tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
            tileSize: 256,
            attribution:
              '© <a href="https://openstreetmap.org" target="_blank">OpenStreetMap</a> contributors',
          },
        },
        layers: [
          {
            id: "osm-tiles",
            type: "raster",
            source: "osm",
            minzoom: 0,
            maxzoom: 24,
          },
        ],
      },
      attributionControl: false,
    });

    map.current.addControl(
      new maplibregl.AttributionControl({
        compact: true,
      }),
      "top-left"
    );

    map.current.on("click", (e) => {
      const { lng: longitude, lat: latitude } = e.lngLat;
      console.log(
        `Clicked coordinates: Longitude: ${longitude}, Latitude: ${latitude}`
      );
      console.log("currentPositionRef: ", currentPositionRef.current);

      const fetchLocation = async () => {
        if (currentPositionRef.current) {
          const result = await ApiService.fetchReverseGeocoding(
            currentPositionRef.current,
            { longitude, latitude },
            "destination"
          );
          console.log("mapClicked: ", result);
          handleLocationSelect(result, "destination");
        } else {
          console.log("currentPositionが入ってないよ");
        }
      };

      fetchLocation();
    });
  }, [
    handleLocationSelect,
    mapState.latitude,
    mapState.longitude,
    mapState.zoom,
  ]);

  const addRouteLayer = useCallback(
    (route) => {
      if (map.current.getSource("route")) {
        map.current.getSource("route").setData(route);
      } else {
        map.current.addSource("route", {
          type: "geojson",
          data: route,
        });

        map.current.addLayer({
          id: "route-line",
          type: "line",
          source: "route",
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#0074D9",
            "line-width": 7,
          },
        });
      }
    },
    [map]
  );

  const fetchShortestRoute = useCallback(async () => {
    const result = await ApiService.fetchShortestRoute(
      startLocation,
      destinationLocation
    );
    if (result) {
      const { route, instructions, totalDistance } = result;
      addRouteLayer(route);
      console.log("route: ", route)
      setInstructions(instructions);
      setTotalDistance(totalDistance);
    }
  }, [
    startLocation,
    destinationLocation,
    setInstructions,
    setTotalDistance,
    addRouteLayer,
  ]);

  const setCurrentPositionMarker = useCallback(() => {
    if (!map.current || !currentPosition) {
      console.warn("Invalid currentPosition:", currentPosition);
      return;
    }

    if (currentPositionMarker.current) {
      animateMarker(
        currentPositionMarker.current,
        currentPositionMarker.current.getLngLat(),
        [currentPosition.longitude, currentPosition.latitude],
        1000
      );
    } else {
      const markerElement = document.createElement("div");
      const root = ReactDOM.createRoot(markerElement);
      root.render(<MapAnnotation />);
      currentPositionMarker.current = new maplibregl.Marker({
        element: markerElement,
      })
        .setLngLat([currentPosition.longitude, currentPosition.latitude])
        .addTo(map.current);
    }

    if (!hasFlyToExecuted.current) {
      map.current.flyTo({
        center: [currentPosition.longitude, currentPosition.latitude],
        zoom: 16,
      });
      hasFlyToExecuted.current = true;
    }
  }, [currentPosition]);

  const setDestinationMarker = useCallback(() => {
    if (!map.current) return;

    if (destinationMarker.current) {
      destinationMarker.current.remove();
      destinationMarker.current = null;
    }

    if (destinationLocation) {
      destinationMarker.current = new maplibregl.Marker()
        .setLngLat([
          destinationLocation.longitude,
          destinationLocation.latitude,
        ])
        .addTo(map.current);

      map.current.flyTo({
        center: [destinationLocation.longitude, destinationLocation.latitude],
        zoom: 14,
      });
    }
  }, [destinationLocation]);

  const removeRouteLayer = useCallback(() => {
    if (!map.current) return;

    if (map.current.getLayer("route-line")) {
      map.current.removeLayer("route-line");
    }

    if (map.current.getSource("route")) {
      map.current.removeSource("route");
    }
  }, []);

  const removeDestinationMarker = useCallback(() => {
    if (destinationMarker.current) {
      destinationMarker.current.remove();
      destinationMarker.current = null;
    }
  }, []);

  const animateMarker = (marker, start, end, duration) => {
    const startTime = performance.now();

    const animate = (time) => {
      const elapsed = time - startTime;
      const t = Math.min(elapsed / duration, 1);

      const interpolated = [
        start.lng + t * (end[0] - start.lng),
        start.lat + t * (end[1] - start.lat),
      ];

      marker.setLngLat(interpolated);

      if (t < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  };

  useEffect(() => {
    initializeMap();
  }, [initializeMap]);

  useEffect(() => {
    setCurrentPositionMarker();
    currentPositionRef.current = currentPosition;
  }, [setCurrentPositionMarker, currentPosition]);

  useEffect(() => {
    setDestinationMarker();
  }, [setDestinationMarker]);

  useEffect(() => {
    if (!startLocation || !destinationLocation) return;

    const handlePhase = {
      setTime: fetchShortestRoute,
      routeSelect: () => {
        removeRouteLayer();
        const routeInfo = routeInformation[currentIndex];
        if (routeInfo?.route) {
          addRouteLayer(routeInfo.route);
          setInstructions(routeInfo.instructions);
          setTotalDistance(routeInfo.totalDistance);
        }
      },
      routeGuidance: () => {
        map.current.flyTo({
          center: [startLocation.longitude, startLocation.latitude],
          zoom: 16,
        });
      },
      default: () => {
        removeDestinationMarker();
        removeRouteLayer();
        // handleInitializeRouteInformation();
      },
    };

    (handlePhase[phase] || handlePhase.default)();
  }, [
    phase,
    startLocation,
    destinationLocation,
    fetchShortestRoute,
    addRouteLayer,
    currentIndex,
    routeInformation,
    setInstructions,
    setTotalDistance,
    removeDestinationMarker,
    removeRouteLayer,
    // handleInitializeRouteInformation,
  ]);

  useEffect(() => {
    if (!map.current) return;

    if (currentPosition && isUserLocationButtonActive) {
      map.current.flyTo({
        center: [currentPosition.longitude, currentPosition.latitude],
        zoom: 16,
      });
    }
    setIsUserLocationButtonActive(false);
  }, [
    currentPosition,
    isUserLocationButtonActive,
    setIsUserLocationButtonActive,
  ]);

  return <div ref={mapContainer} className="map-container" />;
};

export default MapView;
