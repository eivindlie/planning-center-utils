export const getStartOfSemester = (): Date => {
  const today = new Date();
  if (today.getMonth() >= 11) {
    return new Date(today.getFullYear() + 1, 0, 1);
  } else if (today.getMonth() >= 5) {
    return new Date(today.getFullYear(), 6, 1);
  } else {
    return new Date(today.getFullYear(), 0, 1);
  }
};

export const getEndOfSemester = (): Date => {
  const today = new Date();
  if (today.getMonth() >= 11) {
    return new Date(today.getFullYear() + 1, 5, 30);
  } else if (today.getMonth() >= 5) {
    return new Date(today.getFullYear(), 11, 31);
  } else {
    return new Date(today.getFullYear(), 5, 30);
  }
};

export const formatDate = (date: Date): string => {
  return `${date.getDate().toString().padStart(2, "0")}.${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}.${date.getFullYear()}`;
};
