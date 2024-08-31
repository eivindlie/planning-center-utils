import { ScoringFunction } from "./types";
import { applyLockedDates, findAllIndexes } from "./utils";

const calculateTeamAbsences: ScoringFunction = (chromosome, config) => {
  const { blockouts } = config;
  const score = chromosome
    .map((team, date) =>
      team === ""
        ? 0
        : blockouts[team]
            .map((memberBlockouts) => memberBlockouts[date])
            .reduce((acc, blockout) => acc + blockout, 0) /
          blockouts[team].length
    )
    .reduce((acc, teamAbsences) => acc + teamAbsences, 0);
  return score;
};

const calculateAverageLengthBetweenTeams: ScoringFunction = (
  chromosome,
  config
) => {
  // Find all intervals between team appearances (including at the start and end of the chromosome)
  const intervals: number[] = [];
  for (const team of config.teams) {
    const teamAppearances = [0, ...findAllIndexes(chromosome, team)];
    teamAppearances.forEach((date, index) => {
      const nextIndex = teamAppearances[index + 1];
      intervals.push(
        nextIndex === undefined ? chromosome.length - date : nextIndex - date
      );
    });
  }
  const score = Math.sqrt(
    intervals.reduce(
      (acc, interval) => acc + Math.pow(interval - config.teams.length, 2),
      0
    )
  );
  return score;
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
  const score = appearances
    .map((acc, index) =>
      Math.abs(acc - appearances[(index + 1) % appearances.length])
    )
    .reduce((acc, diff) => acc + diff, 0);

  return score;
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
  const score = Math.sqrt(scorePerTeam.reduce((acc, score) => acc + score, 0));

  return score;
};

const SCORING_FUNCTIONS: [ScoringFunction, number][] = [
  [calculateTeamAbsences, 4],
  [calculateAverageLengthBetweenTeams, 1],
  [calculateTotalDifferenceBetweenTeamAppearances, 2],
  [calculateAverageTimesMissingPerPerson, 2],
];

export const calculateScore: ScoringFunction = (
  chromosome,
  config,
  debug = false
) => {
  const chromosomeWithLockedDates = applyLockedDates(chromosome, config);
  return SCORING_FUNCTIONS.map(([fn, weight]) => {
    const score = fn(chromosomeWithLockedDates, config, debug) * weight;
    if (debug) {
      console.log(`${fn.name} score: ${score}`);
    }
    return score;
  }).reduce((acc, score) => acc + score, 0);
};
