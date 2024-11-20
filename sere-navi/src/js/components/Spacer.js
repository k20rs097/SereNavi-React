import React from "react";
import PropTypes from "prop-types";

const Spacer = ({ size, axis, style = {} }) => {
  const width = axis === "vertical" ? 1 : size;
  const height = axis === "horizontal" ? 1 : size;
  
  return (
    <div
      style={{
        width,
        minWidth: width,
        height,
        minHeight: height,
        ...style
      }}
    />
  );
};

Spacer.propTypes = {
  size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  axis: PropTypes.oneOf(["horizontal", "vertical"]).isRequired,
  style: PropTypes.object
};

export default Spacer;