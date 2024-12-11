import React from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const LoadingView = () => {
  return (
    <div className="loading-view">
      <div className="loading-view__text">
        <AiOutlineLoading3Quarters />
      </div>
    </div>
  );
};

export default LoadingView;
