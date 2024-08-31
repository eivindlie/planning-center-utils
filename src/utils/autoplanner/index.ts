import { crossover } from "./crossover";
import { mutate } from "./mutation";
import { calculateScore } from "./scoring";
import { TEST_CONFIG } from "./testData";
import { AutoplannerConfig, Chromosome } from "./types";

const createRandomChromosome = (
  length: number,
  config: AutoplannerConfig
): Chromosome => {
  return Array.from({ length }, () => {
    const team = config.teams[Math.floor(Math.random() * config.teams.length)];
    return team;
  });
};

const createInitialPopulation = (size: number, config: AutoplannerConfig) => {
  return Array.from({ length: size }, () =>
    createRandomChromosome(config.lockedDates.length, config)
  );
};

const selection = (
  population: Chromosome[],
  scores: number[],
  eliteSize: number
) => {
  const sortedPopulation = population
    .map((chromosome, index) => ({ chromosome, score: scores[index] }))
    .sort((a, b) => a.score - b.score);
  const elite = sortedPopulation.slice(0, eliteSize).map((el) => el.chromosome);
  const newPopulation = elite.slice();
  while (newPopulation.length < population.length) {
    const competitors = [
      sortedPopulation[Math.floor(Math.random() * sortedPopulation.length)],
      sortedPopulation[Math.floor(Math.random() * sortedPopulation.length)],
    ];
    newPopulation.push(
      (competitors[0].score < competitors[1].score
        ? competitors[0]
        : competitors[1]
      ).chromosome
    );
  }
  return newPopulation;
};

const recombine = (matingPool: Chromosome[], eliteSize: number) => {
  const children = matingPool.slice(0, eliteSize);
  while (children.length < matingPool.length) {
    const parent1 = matingPool[Math.floor(Math.random() * matingPool.length)];
    const parent2 = matingPool[Math.floor(Math.random() * matingPool.length)];
    children.push(crossover(parent1, parent2));
  }
  return children;
};

const mutatePopulation = (
  population: Chromosome[],
  mutationRate: number,
  config: AutoplannerConfig
) => {
  return population.map((chromosome) =>
    Math.random() < mutationRate ? mutate(chromosome, config) : chromosome
  );
};

export const solve = () => {
  const eliteSize = 10;
  const populationSize = 100;
  const mutationRate = 0.1;
  const config = TEST_CONFIG;
  let population = createInitialPopulation(populationSize, config);
  let scores = population.map((chromosome) =>
    calculateScore(chromosome, config)
  );
  console.log(`Initial best score: ${Math.min(...scores)}`);

  for (let i = 0; i < 100; i++) {
    const matingPool = selection(population, scores, eliteSize);
    const children = recombine(matingPool, eliteSize);
    const newPopulation = mutatePopulation(children, mutationRate, config);
    const newScores = newPopulation.map((chromosome) =>
      calculateScore(chromosome, config)
    );
    console.log(`Generation ${i + 1} best score: ${Math.min(...newScores)}`);
    population = newPopulation;
    scores = newScores;
  }
};
