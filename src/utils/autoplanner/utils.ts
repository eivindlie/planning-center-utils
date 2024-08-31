export const findAllIndexes = <T>(arr: T[], val: T): number[] => {
  const indexes: number[] = [];
  arr.forEach((el, index) => el === val && indexes.push(index));
  return indexes;
};
