import { Chromosome, AutoplannerConfig } from "./types";

export const findAllIndexes = <T>(arr: T[], val: T): number[] => {
  const indexes: number[] = [];
  arr.forEach((el, index) => el === val && indexes.push(index));
  return indexes;
};

export const applyLockedDates = (
  chromosome: Chromosome,
  config: AutoplannerConfig
): Chromosome => {
  return chromosome.map((team, index) =>
    config.lockedDates[index] === undefined
      ? team
      : (config.lockedDates[index] as string)
  );
};
