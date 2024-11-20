import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import axios from "axios";

const SearchTextField = ({ onClick, onResultsChange, currentPosition }) => {
  const [query, setQuery] = useState("");

  const defaultLat = 33.670640985229866;
  const defaultLon = 130.44456600125582;
  //   const radiusKm = 10;

  // ハーサイン距離を計算する関数
  const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // 地球の半径 (km)
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // 距離 (km)
    return distance;
  };

  const getBoundingBox = (lat, lon, radius) => {
    const delta = radius * 0.009;

    return [
      lon - delta, // 西
      lat - delta, // 南
      lon + delta, // 東
      lat + delta, // 北
    ];
  };

  const handleSearch = async () => {
    try {
      
      const radiusKm = 10;
      let centerLat;
      let centerLon
      if (currentPosition) {
        centerLat = currentPosition.latitude;
        centerLon = currentPosition.longitude;
      } else {
        centerLat = defaultLat;
        centerLon = defaultLon;
      }
      const [west, south, east, north] = getBoundingBox(centerLat, centerLon, radiusKm);

      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search`,
        {
          params: {
            q: query,
            format: "json",
            addresdetails: 1,
            limit: 20,
            viewbox: `${west},${south},${east},${north}`,
            bounded: 1,
          },
        }
      );
      if (response.data.length !== 0) {
        console.log(`response.data`, response.data);

        const sortedResults = response.data
          .map((result) => ({
            ...result,
            distance: haversineDistance(
              centerLat,
              centerLon,
              result.lat,
              result.lon
            ),
          }))
          .sort((a, b) => a.distance - b.distance);

        onResultsChange(sortedResults);
      } else {
        console.log(`response.data`, response.data);
        onResultsChange([
          { display_name: `${query}に一致する場所が見つかりませんでした` },
        ]);
      }
    } catch (error) {
      console.error(`Error fetching Nomination: ${error}`);
    }
  };

  return (
    <div className="search-text-field" onClick={onClick}>
      <div className="search-text-box">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="場所を検索"
        />
      </div>
      <div className="search-icon">
        <button onClick={handleSearch}>
          <FaSearch />
        </button>
      </div>
    </div>
  );
};

export default SearchTextField;
