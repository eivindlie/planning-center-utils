export const formatDate = (date: Date): string => {
  const yyyy = date.getFullYear();
  let mm = (date.getMonth() + 1).toString(); // Months start at 0!
  let dd = date.getDate().toString();

  if (dd.length < 2) dd = "0" + dd;
  if (mm.length < 2) mm = "0" + mm;

  const formattedDate = dd + "." + mm + "." + yyyy;
  return formattedDate;
};

export const formatDateTime = (date: Date): string => {
  return Intl.DateTimeFormat("nb-NO", {
    timeZone: "Europe/Oslo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};
