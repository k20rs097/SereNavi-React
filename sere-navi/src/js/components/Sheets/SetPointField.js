import React from "react";
import { CgArrowsExchangeAltV } from "react-icons/cg";

const SetPointField = ({
  startLocation,
  currentPosition,
  destinationLocation,
  swapLocations,
  handleOpenSearch,
}) => {

  const handleLocationTextClick = (className) => {
    console.log("handleLocationTextClick: ", className);
    handleOpenSearch(className);
  }

  const renderLocation = (className, location, defaultName) => (
    <div
      className={`location-text ${className}`}
      onClick={() => handleLocationTextClick(className)}
    >
      {location?.name || defaultName}
    </div>
  );

  return (
    <div className="set-point-field">
      <div className="set-point-field__input">
        {renderLocation(
          "start",
          currentPosition && startLocation ? startLocation : null,
          "現在地",
        )}

        <div className="field-border">
          <hr />
        </div>
        {renderLocation(
          "destination",
          destinationLocation,
          "目的地",
        )}
      </div>

      <button className="change-location-button" onClick={swapLocations}>
        <CgArrowsExchangeAltV />
      </button>
    </div>
  );
};

export default SetPointField;
