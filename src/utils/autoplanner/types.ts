export type BlockoutMap = {
  [team: Team]: number[][];
};

export type Team = string;

export type Chromosome = Team[];

export type OtherTeam = "";

export type LockedDatesMask = (Team | undefined | OtherTeam)[];

export type AutoplannerConfig = {
  teams: Team[];
  blockouts: BlockoutMap;
  lockedDates: LockedDatesMask;
};

export type ScoringFunction = (
  chromosome: Chromosome,
  config: AutoplannerConfig,
  debug?: boolean
) => number;
