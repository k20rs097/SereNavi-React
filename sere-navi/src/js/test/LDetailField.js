import React, { useEffect, useState } from "react";
import { BottomSheet } from "react-spring-bottom-sheet";
import "react-spring-bottom-sheet/dist/style.css";
import { RxCross2 } from "react-icons/rx";
import { Range } from "react-range";
import SetPointField from "../components/Sheets/SetPointField";
import Formatters from "../Formatters";
import ApiService from "../ApiService";

const LDetailField = ({
  open,
  onClose,
  currentPosition,
  startLocation,
  destinationLocation,
  setStartLocation,
  swapLocations,
  handleOpenSearch,
  handleStartRouteGuidance,
}) => {
  const [isFetched, setIsFetched] = useState(false);
  const [requiredTime, setRequiredTime] = useState([0]);
  const handleOnClose = () => {
    onClose();
    setIsFetched(false);
  };

  // 最初に開いた一回きりにする？
  // 閉じた時にリセットする
  useEffect(() => {
    const fetchLocation = async () => {
      if (open && currentPosition && !isFetched) {
        console.log(
          "fetchReverseGeocoding for set startLocation",
          currentPosition,
          startLocation
        );
        const result = await ApiService.fetchReverseGeocoding(
          currentPosition,
          startLocation,
          "start"
        );
        console.log("result: ", result);
        if (result) {
          setStartLocation(result);
          setIsFetched(true);
        }
      }
    };

    fetchLocation();
  }, [open, currentPosition, isFetched]);

  // 現在地情報を取得してない時の表示をどうにかする
  const renderLocationInformation = () => (
    <section id="location-information" className="sheet-text">
      {destinationLocation ? (
        <>
          <h1 className="sheet-text__location">
            {destinationLocation.name || destinationLocation.display_name[1][0]}
          </h1>
          <h2 className="sheet-text__distance">
            {startLocation
              ? Formatters.getFormattedDistance(
                  startLocation.latitude,
                  startLocation.longitude,
                  destinationLocation.latitude,
                  destinationLocation.longitude
                )
              : "-- km"}
          </h2>
        </>
      ) : (
        <h1 className="sheet-text__location">場所が見つかりませんでした</h1>
      )}
    </section>
  );

  const renderLocationInformationDetail = () => (
    <section id="location-information-detail" className="sheet-text">
      {destinationLocation ? (
        <>
          <h1 className="sheet-text__details">住所</h1>
          {Array.isArray(destinationLocation.display_name) &&
            destinationLocation.display_name.map((address, index) => (
              <div key={index} className="sheet-text__address">
                {address}
              </div>
            ))}
        </>
      ) : (
        <h1 className="sheet-text__details">
          目的地情報が見つかりませんでした
        </h1>
      )}
    </section>
  );

  const renderRequiredTimeRange = ({ requiredTime, setRequiredTime }) => {
    return (
      <div className="set-required-time-range">
        <Range
          label="required-time"
          step={5}
          min={0}
          max={1440}
          values={requiredTime}
          onChange={(values) => setRequiredTime(values)}
          renderTrack={({ props, children }) => (
            <div
              {...props}
              style={{
                ...props.style,
                height: "6px",
                width: "60vw",
                backgroundColor: "#ccc",
              }}
            >
              {children}
            </div>
          )}
          renderThumb={({ props }) => (
            <div
              {...props}
              key={props.key}
              style={{
                ...props.style,
                height: "3rem",
                width: "3rem",
                borderRadius: "50%",
                backgroundColor: "#999",
              }}
            />
          )}
        />
      </div>
    );
  };

  const renderStartInstructionButton = () => {
    return (
      <button
        className="start-instruction-button"
        onClick={() => {
          handleStartRouteGuidance();
        }}
      >
        歩く
      </button>
    );
  };

  const renderTimeControllerView = () => (
    <>
      <div className="time-information">
        <div className="time-information__time">
          {Formatters.getFormattedTime(requiredTime)}
        </div>
        <div className="time-information__distance">
          {Formatters.getFormattedDistance(null, null, null, null, requiredTime * ((4.5 / 60)))}
        </div>
      </div>
      <div className="time-controller-view">
        {renderRequiredTimeRange({ requiredTime, setRequiredTime })}
        {renderStartInstructionButton()}
      </div>
    </>
  );

  return (
    <div className="location-detail-field">
      <button className="close-button" onClick={handleOnClose}>
        <RxCross2 />
      </button>
      {renderLocationInformation()}
      <SetPointField
        startLocation={startLocation}
        currentPosition={currentPosition}
        destinationLocation={destinationLocation}
        swapLocations={swapLocations}
        handleOpenSearch={handleOpenSearch}
      />
      <div>
        {renderTimeControllerView()}
        {renderLocationInformationDetail()}
      </div>
    </div>
  );
};

export default LDetailField;
