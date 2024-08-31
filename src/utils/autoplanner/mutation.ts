import { AutoplannerConfig, Chromosome } from "./types";

type MutationFunction = (
  chromosome: Chromosome,
  config: AutoplannerConfig
) => Chromosome;

const swapMutation: MutationFunction = (chromosome) => {
  const mutatedChromosome = chromosome.slice();
  const index1 = Math.floor(Math.random() * chromosome.length);
  const index2 = Math.floor(Math.random() * chromosome.length);
  const temp = mutatedChromosome[index1];
  mutatedChromosome[index1] = mutatedChromosome[index2];
  mutatedChromosome[index2] = temp;
  return mutatedChromosome;
};

const shiftMutation: MutationFunction = (chromosome) => {
  const mutatedChromosome = chromosome.slice();
  const index1 = Math.floor(Math.random() * chromosome.length);
  const index2 = Math.floor(Math.random() * chromosome.length);
  const temp = mutatedChromosome[index1];
  mutatedChromosome.splice(index1, 1);
  mutatedChromosome.splice(index2, 0, temp);
  return mutatedChromosome;
};

const replaceMutation: MutationFunction = (chromosome, config) => {
  const mutatedChromosome = chromosome.slice();
  const index = Math.floor(Math.random() * chromosome.length);
  const newValue =
    config.teams[Math.floor(Math.random() * config.teams.length)];
  mutatedChromosome[index] = newValue;
  return mutatedChromosome;
};

const MUTATIONS: [MutationFunction, number][] = [
  [swapMutation, 0.5],
  [shiftMutation, 0],
  [replaceMutation, 1],
];

export const mutate = (chromosome: Chromosome, config: AutoplannerConfig) => {
  MUTATIONS.forEach(([mutation, probability]) => {
    if (Math.random() < probability) {
      chromosome = mutation(chromosome, config);
    }
  });
  return chromosome;
};
