import { ScoringFunction } from "./types";

const calculateTeamAbsences: ScoringFunction = (chromosome, config) => {
  const { blockouts } = config;
  return chromosome
    .map(
      (team, date) =>
        blockouts[team]
          .map((memberBlockouts) => memberBlockouts[date])
          .reduce((acc, blockout) => acc + blockout, 0) / blockouts[team].length
    )
    .reduce((acc, teamAbsences) => acc + teamAbsences, 0);
};

const calculateAverageLengthBetweenTeams: ScoringFunction = (
  chromosome,
  config
) => {
  // TODO Calculate the average (or MSE?) length between times that each team is scheduled
};

const calculateTotalDifferenceBetweenTeamAppearances: ScoringFunction = (
  chromosome,
  config
) => {
  // TODO Calculate the total difference between times that each team is scheduled
};

const calculateAverageTimesMissingPerPerson: ScoringFunction = (
  chromosome,
  config
) => {
  // TODO Calculate the average (or MSE?) number of times each person is missing
};
