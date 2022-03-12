export const getStartOfSemester = (): Date => {
  const today = new Date();
  if (today.getMonth() >= 6) {
    return new Date(today.getFullYear(), 6, 1);
  } else {
    return new Date(today.getFullYear(), 0, 1);
  }
};

export const getEndOfSemester = (): Date => {
  const today = new Date();
  if (today.getMonth() >= 6) {
    return new Date(today.getFullYear(), 11, 31);
  } else {
    return new Date(today.getFullYear(), 5, 30);
  }
};
