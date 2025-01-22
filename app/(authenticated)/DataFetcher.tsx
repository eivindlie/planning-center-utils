"use client";
import { runExport } from "@/export/export";
import { useState, useEffect } from "react";
import styles from "./DataFetcher.module.css";

export const DataFetcher = ({ lastData }: { lastData: Date }) => {
  const [loadingData, setLoadingData] = useState(false);
  const [hasLoadedData, setHasLoadedData] = useState(false);

  const doDataFetch = async () => {
    setLoadingData(true);
    await runExport();
    setLoadingData(false);
    setHasLoadedData(true);
  };

  useEffect(() => {
    const now = new Date();
    if (now.getTime() - lastData.getTime() > 30 * 60 * 1000) {
      doDataFetch();
    }
  }, []);

  if (loadingData) {
    return <div className={styles.container}>Henter nyeste data...</div>;
  }

  if (hasLoadedData) {
    return (
      <div className={styles.container}>
        <p>Oppdaterte data tilgjengelig</p>
        <button onClick={() => window.location.reload()}>
          Oppdater
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <button onClick={doDataFetch}>Hent nyeste data</button>
    </div>
  );
};
