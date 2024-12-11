import React, { useState, useEffect, useCallback } from "react";
import { BrowserRouter } from "react-router-dom";
import "./App.scss";
import "./scss/containers.scss";
import MapView from "./js/components/Map/MapView";
import LocationSearchView from "./js/components/Sheets/LocationSearchView";
import LocationDetailView from "./js/components/Sheets/LocationDetailView";
import OpenSearchFieldButton from "./js/components/OpenSearchFieldButton";
import MapUserLocationButton from "./js/components/Map/MapUserLocationButton";
import LoadingView from "./js/components/LoadingView";
import InstructionView from "./js/components/InstructionView";
import RouteSelectView from "./js/components/RouteSelectView";
import DeviceUtils from "./js/DeviceUtils";
// import { setMaxParallelImageRequests } from "maplibre-gl";

const App = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [startLocation, setStartLocation] = useState(null);
  const [destinationLocation, setDestinationLocation] = useState(null);
  const [instructions, setInstructions] = useState([]);
  const [routeInformation, setRouteInformation] = useState([
    {
      id: 0,
      title: "ルート1",
      totalTime: null,
      totalDistance: null,
      checkpoint: null,
      route: [], // ORSMのルート情報
      instructions: [], // ORSMのナビゲーション指示
    },
    {
      id: 1,
      title: "ルート2",
      totalTime: null,
      totalDistance: null,
      checkpoint: null,
      route: [],
      instructions: [],
    },
    {
      id: 2,
      title: "ルート3",
      totalTime: null,
      totalDistance: null,
      checkpoint: null,
      route: [],
      instructions: [],
    },
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [totalDistance, setTotalDistance] = useState(0);
  const [requiredTime, setRequiredTime] = useState([0]);
  const [isLoading, setIsLoading] = useState(false);
  const [locationType, setLocationType] = useState("destination");
  const [isUserLocationButtonActive, setIsUserLocationButtonActive] =
    useState(false);
  const [isFollowingCurrentLocation, setIsFollowingCurrentLocation] =
    useState(false);
  const [phase, setPhase] = useState("launched");

  useEffect(() => {
    DeviceUtils.watchUserLocation(
      setIsFollowingCurrentLocation,
      setCurrentPosition
    );
  }, []);

  const handleOpenSearch = (locationType) => {
    setLocationType(locationType);
  };

  const handleLocationSelect = (location, locationType) => {
    setLocationType(locationType);
    setPhase("setTime");
    // console.log(`locationType: ${locationType}`);
    if (locationType === "start") {
      setStartLocation(location);
      console.log(`setStartLocation: ${startLocation?.latitude}, ${startLocation?.longitude}`);
    } else if (locationType === "destination") {
      setDestinationLocation(location);
      console.log(`setDestinationLocation: ${destinationLocation?.latitude}, ${destinationLocation?.longitude}`);
    }
  };

  const swapLocations = () => {
    setStartLocation(destinationLocation);
    console.log(`setStartLocation: ${startLocation.latitude}, ${startLocation.longitude}`);
    setDestinationLocation(startLocation);
    console.log(`setDestinationLocation: ${destinationLocation?.latitude}, ${destinationLocation?.longitude}`);
  };

  const handleUserLocationButtonClick = () => {
    setIsUserLocationButtonActive(true);
    setLocationType("destination");
  };

  const handleStartRouteSelect = () => {
    console.log(`startLocation: ${startLocation.latitude}, ${startLocation.longitude}`);
    console.log(`destinationLocation: ${destinationLocation.latitude}, ${destinationLocation.longitude}`);
    console.log(`requiredTime: ${requiredTime}`);
    setPhase("routeSelect");
  };

  const handleStartRouteGuidance = () => {
    setPhase("routeGuidance");
  };

  const handleEndRouteGuidance = () => {
    handleInitializeRouteInformation();
    setPhase("launched");
  };

  const handleInitializeRouteInformation = useCallback(() => {
    setRouteInformation([
      {
        id: 0,
        title: "ルート1",
        totalTime: null,
        totalDistance: null,
        checkpoint: null,
        route: [],
        instructions: [],
      },
      {
        id: 1,
        title: "ルート2",
        totalTime: null,
        totalDistance: null,
        checkpoint: null,
        route: [],
        instructions: [],
      },
      {
        id: 2,
        title: "ルート3",
        totalTime: null,
        totalDistance: null,
        checkpoint: null,
        route: [],
        instructions: [],
      },
    ]);
  }, []);

  return (
    <BrowserRouter>
      <div
        className="app"
        // style={styles.container}
      >
        <div
          className="container__map"
          // style={styles.mapContainer}
        >
          <MapView
            currentPosition={currentPosition}
            startLocation={startLocation}
            destinationLocation={destinationLocation}
            isUserLocationButtonActive={isUserLocationButtonActive}
            setIsUserLocationButtonActive={setIsUserLocationButtonActive}
            phase={phase}
            currentIndex={currentIndex}
            routeInformation={routeInformation}
            handleLocationSelect={handleLocationSelect}
            setInstructions={setInstructions}
            setTotalDistance={setTotalDistance}
            handleInitializeRouteInformation={handleInitializeRouteInformation}
          />
          {isFollowingCurrentLocation && (
            <div
              className="container__buttons"
              // style={styles.mapButtonsContainer}
            >
              <MapUserLocationButton onClick={handleUserLocationButtonClick} />
            </div>
          )}
          {phase === "launched" && (
            <div
              className="container__open"
              // style={styles.searchContainer}
            >
              <OpenSearchFieldButton
                onClick={() => {
                  setPhase("searching");
                }}
              />
            </div>
          )}
          <div className="container__search">
            <LocationSearchView
              results={searchResults}
              open={phase === "searching"}
              currentPosition={currentPosition}
              locationType={locationType}
              onClose={() => {
                setPhase("launched");
              }}
              setIsLoading={setIsLoading}
              setSearchResults={setSearchResults}
              handleLocationSelect={handleLocationSelect}
            />
          </div>
          <div className="container__location">
            <LocationDetailView
              open={phase === "setTime"}
              onClose={() => {
                setPhase("launched");
              }}
              currentPosition={currentPosition}
              startLocation={startLocation}
              destinationLocation={destinationLocation}
              totalDistance={totalDistance}
              requiredTime={requiredTime}
              setStartLocation={setStartLocation}
              swapLocations={swapLocations}
              handleOpenSearch={handleOpenSearch}
              handleStartRouteSelect={handleStartRouteSelect}
              setRequiredTime={setRequiredTime}
            />
          </div>

          {phase === "routeSelect" && (
            <div className="container__route-select">
              <RouteSelectView
                startLocation={{
                  latitude: startLocation?.latitude,
                  longitude: startLocation?.longitude,
                }}
                destinationLocation={{
                  latitude: destinationLocation?.latitude,
                  longitude: destinationLocation?.longitude,
                }}
                requiredTime={requiredTime}
                handleStartRouteGuidance={handleStartRouteGuidance}
                routeInformation={routeInformation}
                setRouteInformation={setRouteInformation}
                currentIndex={currentIndex}
                setCurrentIndex={setCurrentIndex}
              />
            </div>
          )}

          {phase === "routeGuidance" && (
            <>
              <div
                // style={styles.instructionContainer}
                className="container__instruction"
              >
                <InstructionView instructions={instructions} />
              </div>
              <div
              // style={styles.searchContainer}
              >
                <button
                  className="container__end-button"
                  onClick={() => {
                    handleEndRouteGuidance();
                  }}
                >
                  経路案内終了
                </button>
              </div>
            </>
          )}
        </div>
        {isLoading && (
          <div
            // style={styles.loadingContainer}
            className="container__loading"
          >
            <LoadingView />
          </div>
        )}
      </div>
    </BrowserRouter>
  );
};

export default App;

// import React from "react";
// import GetCheckpoint from "./js/test/GetCheckpoint";

// const App = () => {
//     return (
//         <GetCheckpoint />
//     );
// }

// export default App;
