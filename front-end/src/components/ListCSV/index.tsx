"use client";

import React from "react";
import UploadCSV from "../UploadCSV";
import styles from "./styles.module.css";
import Form from "../Form";

export default function ListCSV() {
  const [csvData, setCSVData] = React.useState<any[]>([]);

  return (
    <div className={styles.listCSVContainer}>
      {csvData.length === 0 ? (
        <UploadCSV setCSVData={setCSVData} />
      ) : (
        <div className={styles.listCSVContainerCsvData}>
          <Form setCSVData={setCSVData} />
          {csvData.map((data) => {
            return (
              <div
                className={styles.listCSVContainerCsvColumns}
                key={Math.random() * 1000}
              >
                {Object.keys(data).map((chave) => (
                  <span className={styles.listCSVRow} key={chave}>
                    {`${chave}: ${data[chave]}`}
                    <br />
                  </span>
                ))}
              </div>
            );
          })}
        </div>
      )}
      {csvData.length > 0 ? (
        <button
          className={styles.listCSVAddNewCSV}
          type="button"
          onClick={() => setCSVData([])}
        >
          Add new CSV
        </button>
      ) : null}
    </div>
  );
}
