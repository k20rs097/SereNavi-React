import React from "react";
import ApiService from "../ApiService";

const GetCheckpoint = () => {
  const startLocation = { latitude: 33.673735, longitude: 130.441134 }; // 九産大前
  // 33.659509, 130.444010
  const destinationLocation = { latitude: 33.659509, longitude: 130.444010 }; // 香椎駅
  // const requiredTime = 40;
  const checkpoint = { latitude: 33.662885, longitude: 130.437392}
  return (
    <div>
      <button
        onClick={() => {
          ApiService.fetchRoute(
            startLocation,
            destinationLocation,
            checkpoint
          );
        }}
      >
        Get Checkpoint
      </button>
    </div>
  );
};

export default GetCheckpoint;
