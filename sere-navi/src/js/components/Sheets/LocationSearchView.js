import React, { useRef } from "react";
import { BottomSheet } from "react-spring-bottom-sheet";
import SearchTextField from "./SearchTextField";
import { IoMdPin } from "react-icons/io";
import "react-spring-bottom-sheet/dist/style.css";

const LocationSearchView = ({
  results,
  open,
  onClose,
  currentPosition,
  locationType,
  setIsLoading,
  setSearchResults,
  handleSearchClick,
  handleLocationSelect,
}) => {
  const sheetRef = useRef();

  const renderResultList = (results) => {
    return (
      <div className="result-lists">
        {Array.isArray(results) && results.length > 0 ? (
          results.some((result) => result.notFound) ? (
            <div className="result-list__location">
              場所が見つかりませんでした
            </div>
          ) : (
            results.map((result, index) => (
              <div
                id="result-list"
                // ラップして渡さないとリストのクリックが勝手にトリガーされる
                onClick={() => handleLocationSelect(result, locationType)}
                key={index}
                className="result-list"
              >
                <div className="result-list__pin">
                  <IoMdPin />
                </div>
                <div className="result-list__distance">{result.distance}</div>
                <div className="result-list__location">{result.name}</div>
              </div>
            ))
          )
        ) : (
          <div className="result-list__default-text">場所を検索</div>
        )}
      </div>
    );
  };

  return (
    <div>
      <BottomSheet
        open={open}
        ref={sheetRef}
        onDismiss={onClose}
        snapPoints={({ maxHeight }) => [
          maxHeight - maxHeight / 10, // Top
          maxHeight / 2, // Middle
          maxHeight / 4, // Bottom
        ]}
        header={
          <div className="search-field">
            <SearchTextField
              currentPosition={currentPosition}
              locationType={locationType}
              setIsLoading={setIsLoading}
              onClick={handleSearchClick}
              setSearchResults={setSearchResults}
            />
          </div>
        }
        defaultSnap={({ maxHeight }) => maxHeight / 2}
        blocking={false}
        expandOnContentDrag={true}
      >
        <div className="results">{renderResultList(results)}</div>
      </BottomSheet>
    </div>
  );
};

export default LocationSearchView;
