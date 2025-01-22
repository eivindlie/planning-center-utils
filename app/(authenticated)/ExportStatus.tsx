import prisma from "@/prisma/client";
import { formatDateTime } from "@/utils/formatDate";
import { DataFetcher } from "./DataFetcher";

export const ExportStatus = async () => {
  const latestExport = await prisma.exportLog.findFirst({
    orderBy: {
      time: "desc",
    },
  });

  if (!latestExport) {
    return <div>Ingen data tilgjengelig</div>;
  }

  return (
    <div>
      Data uthentet: {formatDateTime(latestExport?.time)}{" "}
      <DataFetcher lastData={latestExport.time} />
    </div>
  );
};
