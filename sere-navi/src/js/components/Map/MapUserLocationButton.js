import React from "react";
import { TbLocationFilled } from "react-icons/tb";

const MapUserLocationButton = ({ onClick }) => {
  return (
    <div className="map-user-location-button" onClick={onClick}>
      <TbLocationFilled />
    </div>
  );
};

export default MapUserLocationButton;
