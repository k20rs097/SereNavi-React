import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import axios from "axios";
import formatters from "../../Formatters";

const SearchTextField = ({
  currentPosition,
  locationEditType,
  onClick,
  setIsLoading,
  setSearchResults,
}) => {
  const [query, setQuery] = useState("");

  const handleSearch = async (e) => {
    e.stopPropagation(); // onClickの伝播を防止
    if (!query.trim()) {
      alert("検索キーワードを入力してください");
      return;
    }
    setIsLoading(true);
    console.log("setIsLoading(true)");
    try {
      // const radiusKm = 10;
      const position = currentPosition;

      const requestUrl = "https://nominatim.openstreetmap.org/search";
      const response = await axios.get(requestUrl, {
        params: {
          q: query,
          format: "json",
          addressdetails: "1",
          limit: "50",
          bounded: "1",
        },
      });

      if (response.data.length > 0) {
        const processedResults = response.data.map((result) => {
          let distance = "-- m";
          if (position?.latitude && position?.longitude) {
            distance = formatters.getFormattedDistance(
              position.latitude,
              position.longitude,
              result.lat,
              result.lon
            );
          }

          return {
            ...result,
            distance,
            latitude: result.lat,
            longitude: result.lon,
            name: formatters.getProcessedNameByType(result),
            display_name: formatters.getProcessedDisplayName(
              result.display_name
            ),
          };
        });
        // .sort((a, b) => a.distance - b.distance);
        setSearchResults(processedResults);
      } else {
        setSearchResults([{ notFound: true }]);
      }
    } catch (error) {
      console.error("Error fetching data from Nominatim:", error);
      alert("検索に失敗しました.再度お試しください.");
    } finally {
      setIsLoading(false);
    }
  };

  const setPlaceholder = () => {
    switch (locationEditType) {
      case "start":
        return "出発地を検索";
      case "destination":
        return "目的地を検索";
      default:
        return "場所を検索";
    }
  };

  return (
    <div className="search-text-field" onClick={onClick}>
      <div className="search-text-box">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={setPlaceholder()}
        />
      </div>
      <div className="search-icon">
        <button type="button" onClick={handleSearch}>
          <FaSearch />
        </button>
      </div>
    </div>
  );
};

export default SearchTextField;
