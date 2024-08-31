import { Chromosome } from "./types";

const createCrossover = (parent1: Chromosome, parent2: Chromosome) => {
  const child = parent1.slice();
  for (let i = 0; i < child.length; i++) {
    if (Math.random() < 0.5) {
      child[i] = parent2[i];
    }
  }
  return child;
};

export const crossover = createCrossover;
