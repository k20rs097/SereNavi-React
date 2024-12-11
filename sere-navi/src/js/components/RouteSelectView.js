import React, { useRef, useState, useEffect } from "react";
import "../../scss/RouteSelectView.scss";
import ApiService from "../ApiService";

const RouteSelectView = ({
  startLocation,
  destinationLocation,
  requiredTime,
  handleStartRouteGuidance,
  routeInformation,
  setRouteInformation,
  currentIndex,
  setCurrentIndex,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const itemWidth = container.offsetWidth;
      const newIndex = Math.round(scrollLeft / itemWidth);
      setCurrentIndex(newIndex);
    };

    container.addEventListener("scroll", handleScroll);

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [setCurrentIndex]);

  useEffect(() => {
    if (!routeInformation[currentIndex]?.checkpoint) {
      if (!startLocation || !destinationLocation || !requiredTime) {
        console.log(
          `Invalid data: startLocation=${startLocation}, destinationLocation=${destinationLocation}, requiredTime=${requiredTime}`
        );
        return;
      }
      setIsLoading(true);
      (async () => {
        try {
          const checkpointResponse = await ApiService.getCheckpoint(
            startLocation,
            destinationLocation,
            requiredTime
          );

          if (!checkpointResponse || !checkpointResponse?.checkpoint) {
            throw new Error("Invalid checkpoint response");
          }

          console.log(
            `startLocation: ${startLocation.latitude} ${startLocation.longitude}, 
            destinationLocation: ${destinationLocation.latitude} ${destinationLocation.longitude},
            checkpoint: `, checkpointResponse.checkpoint
          );

          const routeResponse = await ApiService.fetchRoute(
            startLocation,
            destinationLocation,
            checkpointResponse.checkpoint
          );
          // console.log("routeResponse: ", routeResponse);

          if (!routeResponse) {
            throw new Error("Invalid route response");
          }

          setRouteInformation((previousRouteInformation) => {
            const updatedRouteInformation = [...previousRouteInformation];
            updatedRouteInformation[currentIndex] = {
              ...updatedRouteInformation[currentIndex],
              checkpoint: checkpointResponse?.checkpoint,
              totalTime: checkpointResponse?.total_time,
              route: routeResponse?.route,
              instructions: routeResponse?.instructions,
              totalDistance: routeResponse?.totalDistance,
            };

            return updatedRouteInformation;
          });
          setIsLoading(false);
        } catch (error) {
          console.error("Failed to fetch checkpoint or route:", error);
        } finally {
          setIsLoading(false);
        }
      })();
    }
  }, [
    routeInformation,
    currentIndex,
    startLocation,
    destinationLocation,
    requiredTime,
    setRouteInformation,
  ]);

  useEffect(() => {
    console.log("Updated routeInformation:", routeInformation);
  }, [routeInformation]);

  const renderRouteInformation = (route) => (
    <div className="route-select__row">
      <div className="route-select__information">{route?.totalTime}分</div>
      <div className="route-select__information">{route?.totalDistance}m</div>
      {/* <div className="route-select__information">{currentIndex}</div> */}
    </div>
  );

  const renderRouteSelectButton = () => (
    <button
      className="route-select__button"
      onClick={() => handleStartRouteGuidance(currentIndex)}
    >
      このルートを歩く
    </button>
  );

  const renderRouteSelectChildren = (routeInformation) =>
    routeInformation.map((route) => {
      if (!isLoading) {
        return (
          <div className="route-select__child" key={route?.id}>
            <div className="route-select__index">道草ルート{route?.id + 1}</div>
            {renderRouteInformation(route)}
            {renderRouteSelectButton()}
          </div>
        );
      } else {
        return (
          <div className="route-select__child" key={route?.id}>
            <div className="route-select__information">道草しています...</div>
          </div>
        );
      }
    });

  return (
    <div className="route-select__parent" ref={scrollContainerRef}>
      {renderRouteSelectChildren(routeInformation)}
    </div>
  );
};

export default RouteSelectView;
