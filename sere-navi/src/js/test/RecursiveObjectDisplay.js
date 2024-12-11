import React from "react";

const RecursiveObjectDisplay = ({ data }) => {
  // 再帰的にオブジェクトや配列をレンダリングする関数
  const renderData = (value) => {
    if (typeof value === "object" && value !== null) {
      if (Array.isArray(value)) {
        // 配列の場合
        return (
          <ul>
            {value.map((item, index) => (
              <li key={index}>
                [{index}] {renderData(item)}
              </li>
            ))}
          </ul>
        );
      } else {
        // オブジェクトの場合
        return (
          <ul>
            {Object.entries(value).map(([key, val]) => (
              <li key={key}>
                <strong>{key}</strong>: {renderData(val)}
              </li>
            ))}
          </ul>
        );
      }
    }
    // プリミティブ型の場合
    return <span>{String(value)}</span>;
  };

  return (
    <div className="recursive-display">
      {data ? renderData(data) : <p>データがありません。</p>}
    </div>
  );
};

export default RecursiveObjectDisplay;
