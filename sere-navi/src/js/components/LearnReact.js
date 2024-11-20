// LearnReact.js
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const LearnReact = () => {
  const position = [51.505, -0.09]; // 初期位置（ロンドン）

  return (
    <MapContainer
      center={position}
      zoom={13}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={position}>
        <Popup>A sample marker!</Popup>
      </Marker>
    </MapContainer>
  );
};

export default LearnReact;
