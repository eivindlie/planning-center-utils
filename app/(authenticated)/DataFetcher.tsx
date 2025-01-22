"use client";
import { runExport } from "@/export/export";
import { useState, useEffect } from "react";

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
    return <div>Henter nyeste data...</div>;
  }

  if (hasLoadedData) {
    return (
      <div>
        <p>Oppdaterte data tilgjengelig</p>
        <button onClick={() => window.location.reload()}>
          Last inn på nytt
        </button>
      </div>
    );
  }

  return (
    <div>
      <button onClick={doDataFetch}>Hent nyeste data</button>
    </div>
  );
};
