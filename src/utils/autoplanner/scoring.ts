import { ScoringFunction } from "./types";
import { findAllIndexes } from "./utils";

const calculateTeamAbsences: ScoringFunction = (chromosome, config) => {
  const { blockouts } = config;
  return chromosome
    .map((team, date) =>
      team === ""
        ? 0
        : blockouts[team]
            .map((memberBlockouts) => memberBlockouts[date])
            .reduce((acc, blockout) => acc + blockout, 0) /
          blockouts[team].length
    )
    .reduce((acc, teamAbsences) => acc + teamAbsences, 0);
};

const calculateAverageLengthBetweenTeams: ScoringFunction = (
  chromosome,
  config
) => {
  // Find interval until next time each team is scheduled for each date
  // TODO This implementation does not account for time before first appearance...
  const intervals = chromosome.map((team, index) => {
    if (team === "") return 0;
    const remainingDates = chromosome.slice(index + 1);
    const nextIndex = remainingDates.indexOf(team);
    return nextIndex === -1 ? remainingDates.length : nextIndex + 1;
  });
  return intervals.reduce(
    (acc, interval) => acc + Math.pow(interval - config.teams.length, 2),
    0
  );
};

const calculateTotalDifferenceBetweenTeamAppearances: ScoringFunction = (
  chromosome,
  config
) => {
  // Calculates the sum of difference between the number of appearances in each pair of teams
  // Ideally, this will sum to 0 if all teams have the same number of appearances
  const appearances = config.teams.map((team) =>
    chromosome.reduce((acc, t) => acc + (t === team ? 1 : 0), 0)
  );
  return appearances
    .map((acc, index) =>
      Math.abs(acc - appearances[(index + 1) % appearances.length])
    )
    .reduce((acc, diff) => acc + diff, 0);
};

const calculateAverageTimesMissingPerPerson: ScoringFunction = (
  chromosome,
  config
) => {
  const scorePerTeam = config.teams.map((team) => {
    const blockoutsPerMember = config.blockouts[team].map(
      (memberBlockouts, memberIndex) => {
        const teamAppearances = findAllIndexes(chromosome, team);
        return teamAppearances
          .map((date) => memberBlockouts[date])
          .reduce((acc, blockout) => acc + blockout, 0);
      }
    );
    // Return squared blockouts per member, normalized by team size
    return (
      blockoutsPerMember
        .map((numBlockouts) => Math.pow(numBlockouts, 2))
        .reduce((acc, numBlockouts) => acc + numBlockouts, 0) /
      blockoutsPerMember.length
    );
  });
  return scorePerTeam.reduce((acc, score) => acc + score, 0);
};

const SCORING_FUNCTIONS: [ScoringFunction, number][] = [
  [calculateTeamAbsences, 1],
  [calculateAverageLengthBetweenTeams, 1],
  [calculateTotalDifferenceBetweenTeamAppearances, 1],
  [calculateAverageTimesMissingPerPerson, 1],
];

export const calculateScore: ScoringFunction = (chromosome, config) => {
  return SCORING_FUNCTIONS.map(
    ([fn, weight]) => fn(chromosome, config) * weight
  ).reduce((acc, score) => acc + score, 0);
};
