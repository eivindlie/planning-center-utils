export type BlockoutMap = {
  [team: Team]: number[][];
};

export type Team = number;

export type Chromosome = number[];

export type OtherTeam = -1;

export type LockedDatesMask = (number | undefined | OtherTeam)[];

export type AutoplannerConfig = {
  teams: Team[];
  blockouts: BlockoutMap;
  lockedDates: LockedDatesMask;
};

export type ScoringFunction = (
  chromosome: Chromosome,
  config: AutoplannerConfig
) => number;
