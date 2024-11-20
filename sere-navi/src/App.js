import React, { useState, useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import "./App.scss";
import MapComponent from "./js/components/Map/MapComponent";
import SearchTextField from "./js/components/SearchTextField";
import SearchResults from "./js/components/SearchResults";

const App = () => {
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [currentPosition, setCurrentPosition] = useState(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition (
        (position) => {
          setCurrentPosition({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error(`Error getting current position ${error}`);
        }
      );
    } else {
      console.log("Geolocation is not available")
    }
  }, []);
  
  const handleSearchClick = () => {
    setIsSearchActive(true);
  };

  const handleCloseSearch = () => {
    setIsSearchActive(false);
  };

  return (
    <BrowserRouter>
      <div style={styles.container}>
        {/* Map Section */}
        <div style={styles.mapContainer}>
          <MapComponent currentPosition={currentPosition} />
        </div>

        {/* Search Field Section */}
        <div
          style={{
            ...styles.searchContainer,
            bottom: isSearchActive ? "90vh" : "5vh",
            transition: "bottom 0.4s ease",
          }}
        >
          <SearchTextField
            onClick={handleSearchClick}
            onResultsChange={setSearchResults}
            currentPosition={currentPosition}
          />
        </div>

        {/* Fullscreen Search Results */}
        <div
          style={{
            ...styles.resultsContainer,
            top: isSearchActive ? "0vh" : "100vh",
            transition: "top 0.4s ease",
          }}
        >
          <SearchResults results={searchResults} onClose={handleCloseSearch} />
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;

// Styling Object
const styles = {
  container: {
    position: "relative",
    width: "100vw",
    height: "100vh",
    overflow: "hidden",
    backgroundColor: "#f4f4f4",
  },
  mapContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },
  searchContainer: {
    position: "absolute",
    left: "50%",
    transform: "translateX(-50%)",
    width: "90%",
    maxWidth: "60rem",
    zIndex: 3,
  },
  resultsContainer: {
    position: "absolute",
    width: "100vw",
    height: "100vh",
    backgroundColor: "#fff",
    zIndex: 2,
    flexDirection: "column",
    overflow: "auto",
  },
};
