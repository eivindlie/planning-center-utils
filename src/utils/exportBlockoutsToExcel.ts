import { IPlan, ITeamWithBlockouts } from "types";
import ExcelJS from "exceljs";
import { formatDate } from "./dates";

export const exportBlockoutsToExcel = (
  teams: ITeamWithBlockouts[],
  plans: IPlan[]
) => {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Fravær");
  addRows(sheet, teams, plans);
  autofitColumns(sheet);
  downloadWorkbook(workbook);
};

const addRows = (
  sheet: ExcelJS.Worksheet,
  teams: ITeamWithBlockouts[],
  plans: IPlan[]
) => {
  const datoRow = sheet.addRow([
    "Dato",
    ...plans.map((p) => formatDate(p.sortDate)),
  ]);
  datoRow.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "ff8eb7e3" },
  };
  sheet.addRow([]);

  for (let t in teams) {
    const team = teams[t];

    const teamNameRow = sheet.addRow([team.teamName]);
    teamNameRow.font = {
      bold: true,
    };

    const teamStartRow = teamNameRow.number + 1;
    for (let m in team.membersWithBlockouts) {
      const member = team.membersWithBlockouts[m];

      sheet.addRow([
        member.member.fullName,
        ...plans.map((p) =>
          member.blockoutDates.some(
            (blockoutDate) =>
              blockoutDate.startsAt <= p.sortDate &&
              blockoutDate.endsAt >= p.sortDate
          )
            ? 1
            : ""
        ),
      ]);
    }

    const teamEndRow = teamStartRow + team.membersWithBlockouts.length - 1;
    const sumRow = sheet.addRow([
      "Sum",
      ...plans.map((plan, p) => {
        const col = sheet.getColumn(p + 2);
        return {
          formula: `SUM(${col.letter}${teamStartRow}:${col.letter}${teamEndRow})`,
        };
      }),
    ]);
    sumRow.font = {
      italic: true,
    };
    const separatorRow = sheet.addRow([""]);
    separatorRow.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "ffc1c1c1" },
    };
  }
};

const autofitColumns = (worksheet: ExcelJS.Worksheet) => {
  worksheet.columns.forEach((column) => {
    var maxLength = 0;
    column["eachCell"]!({ includeEmpty: true }, function (cell) {
      var columnLength = cell.value ? cell.value.toString().length : 10;
      if (columnLength > maxLength) {
        maxLength = columnLength;
      }
    });
    column.width = maxLength < 5 ? 5 : maxLength;
  });
};

const downloadWorkbook = async (workbook: ExcelJS.Workbook) => {
  const buffer = await workbook.xlsx.writeBuffer();
  const base64String = btoa(
    String.fromCharCode.apply(
      null,
      new Uint8Array(buffer) as unknown as number[]
    )
  );
  console.log(base64String);
  downloadBase64File(base64String, "fravær-lovsang.xlsx");
};

const downloadBase64File = (contentBase64: string, fileName: string) => {
  const linkSource = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${contentBase64}`;
  const downloadLink = document.createElement("a");
  document.body.appendChild(downloadLink);

  downloadLink.href = linkSource;
  downloadLink.target = "_self";
  downloadLink.download = fileName;
  downloadLink.click();
};
