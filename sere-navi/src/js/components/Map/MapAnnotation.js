import React from "react";

const MapAnnotation = ({
  color = "#0083FF",
  size = "3vh",
  borderColor = "white",
  children,
}) => {
  const styles = {
    mapAnnotation: {
      position: "relative", // relativeで子要素の位置を調整可能に
      height: size,
      width: size,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: color,
      borderRadius: "50%",
      border: `0.4rem solid ${borderColor}`,
    },
    annotationDirection: {
      position: "absolute", // 親要素内で絶対位置
      top: "50%", // mapAnnotationの中心に配置
      left: "50%",
      transform: "translate(-50%, -100%)", // 中心から上方向に配置
      height: 0,
      width: 0,
      borderLeft: `calc(${size} / 1.5) solid transparent`, // 扇形の幅
      borderRight: `calc(${size} / 1.5) solid transparent`,
      borderTop: `calc(${size} * 1.3) solid ${color}`, // 扇形の高さと色
    },
  };

  return (
    <>
      {/* <div
        className="annotation-direction"
        style={styles.annotationDirection}
      /> */}
      <div className="map-annotation" style={styles.mapAnnotation}>
        {children}
      </div>
    </>
  );
};

export default MapAnnotation;
