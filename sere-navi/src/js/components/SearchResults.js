import React from "react";

const SearchResults = ({ results, onClose }) => {

  return (
    <div style={styles.results}>
      <button onClick={onClose} style={styles.closeButton}>
        閉じる
      </button>
      {/* 文字列が入るとmapのところでエラーが起きる */}
      <div style={styles.resultList}>
        {Array.isArray(results) ? (
          results.map((result, index) => (
            <div key={index}>{result.display_name}</div>
          ))
        ) : (
          <div>エラーが発生しました</div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;

const styles = {
  results: {
    width: "90%",
    margin: "15vh auto 0 auto",
    display: "flex",
    flexDirection: "column",
    padding: "1rem",
  },
  closeButton: {
    alignSelf: "flex-end",
    marginBottom: "1rem",
    padding: "0.5rem 1rem",
    backgroundColor: "#ff5a5f",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  resultList: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    fontSize: "2rem",
  },
};
