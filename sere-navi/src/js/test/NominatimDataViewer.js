import React, { useState, useEffect } from "react";
import RecursiveObjectDisplay from "./RecursiveObjectDisplay";

const NominatimDataViewer = () => {
  const [locationData, setLocationData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://nominatim.openstreetmap.org/search?q=London&format=json&addressdetails=1"
        );
        const data = await response.json();
        setLocationData(data[0]); // 複数の結果の最初のデータを使用
      } catch (error) {
        console.error("データの取得に失敗しました:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Nominatim API データビューア</h1>
      <RecursiveObjectDisplay data={locationData} />
    </div>
  );
};

export default NominatimDataViewer;
