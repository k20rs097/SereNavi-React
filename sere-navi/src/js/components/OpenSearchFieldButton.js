import React from "react";
import { FaSearch } from "react-icons/fa";

const OpenSearchFieldButton = ({ onClick }) => {
  return (
    <div
      id="open-search-text-field-button"
      className="search-text-field"
      onClick={() => onClick("destination")}
    >
      <div className="search-text-box__button">場所を検索</div>
      <div className="search-icon">
        <FaSearch />
      </div>
    </div>
  );
};

export default OpenSearchFieldButton;
