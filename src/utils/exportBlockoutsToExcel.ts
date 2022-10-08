import { IPlan, ITeamWithBlockouts } from "types";
import * as XLSX from "xlsx";
import { formatDate } from "./dates";

export const exportBlockoutsToExcel = (
  teams: ITeamWithBlockouts[],
  plans: IPlan[]
) => {
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.aoa_to_sheet(createRows(teams, plans));
  XLSX.utils.book_append_sheet(workbook, worksheet, "Fravær");
  XLSX.writeFile(workbook, "fravær-lovsang.xlsx", { bookType: "xlsx" });
};

const createRows = (teams: ITeamWithBlockouts[], plans: IPlan[]) => {
  const rows: (string | object)[][] = [];

  rows.push(["Dato", ...plans.map((p) => formatDate(p.sortDate))]);

  for (let t in teams) {
    const team = teams[t];
    rows.push([]);
    rows.push([team.teamName]);

    const teamStartRow = rows.length;
    for (let m in team.membersWithBlockouts) {
      const member = team.membersWithBlockouts[m];
      rows.push([
        member.member.fullName,
        ...plans.map((p) =>
          member.blockoutDates.some(
            (blockoutDate) =>
              blockoutDate.startsAt <= p.sortDate &&
              blockoutDate.endsAt >= p.sortDate
          )
            ? { v: 1, t: "n" }
            : ""
        ),
      ]);
    }
    rows.push([
      "Sum",
      ...plans.map((plan, p) => ({
        f: `SUM(${XLSX.utils.encode_col(p + 1)}${XLSX.utils.encode_row(
          teamStartRow
        )}:${XLSX.utils.encode_col(p + 1)}${XLSX.utils.encode_row(
          rows.length - 1
        )})`,
      })),
    ]);
  }
  return rows;
};
