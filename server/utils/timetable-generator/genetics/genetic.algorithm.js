const Population = require('./population');
const Timetable = require('../objects/timetable');
const Individual = require('./individual');

class GeneticAlgorithm {
    constructor(
        populationSize,
        mutationRate,
        crossoverRate,
        elitismCount,
        tournamentSize) {
        this._populationSize = populationSize;
        this._mutationRate = mutationRate;
        this._crossoverRate = crossoverRate;
        this._elitismCount = elitismCount;
        this._tournamentSize = tournamentSize;
    }

    initPopulation(timetable) {
        return new Population(this._populationSize, timetable);
    }

    isTerminationConditionMet(...params) {
        if (params.length === 1) {
            const population = params[0];
            return population.getFittest(0).getFitness() === 1.0;
        }

        const generationsCount = params[0];
        const maxGenerations = params[1];
        return (generationsCount > maxGenerations);
    }

    calcFitness(individual, timetable) {
        const threadTimetable = new Timetable(timetable);
        threadTimetable.createLessons(individual);

        const clashes = threadTimetable.calcClashes();
        const fitness = 1 / (clashes + 1);

        individual.setFitness(fitness);

        return fitness;
    }

    evalPopulation(population, timetable) {
        let populationFitness = 0;

        for (const individual of population.getIndividuals()) {
            populationFitness += this.calcFitness(individual, timetable);
        }

        population.setPopulationFitness(populationFitness);
    }

    selectParent(population) {
        const tournament = new Population(this._tournamentSize);

        population.shuffle();
        for (let i = 0; i < this._tournamentSize; i++) {
            const tournamentIndividual = population.getIndividual(i);
            tournament.setIndividual(i, tournamentIndividual);
        }

        return tournament.getFittest(0);
    }

    mutatePopulation(population, timetable) {
        const newPopulation = new Population(this._populationSize);

        for (let pi = 0; pi < population.getPopulationSize(); pi++) {
            const individual = population.getFittest(pi);
            const randomIndividual = new Individual(timetable);

            for (let gi = 0; gi < individual.getChromosomeLength(); gi++) {
                if (pi > this._elitismCount) {
                    if (this._mutationRate > Math.random()) {
                        individual.setGene(gi, randomIndividual.getGene(gi));
                    }
                }
            }

            newPopulation.setIndividual(pi, individual);
        }

        return newPopulation;
    }

    crossoverPopulation(population) {
        const newPopulation = new Population(population.getPopulationSize());

        for (let pi = 0; pi < population.getPopulationSize(); pi++) {
            const parent1 = population.getFittest(pi);

            if (this._crossoverRate > Math.random() &&
            pi >= this._elitismCount) {
                const offspring = new Individual(parent1.getChromosomeLength());
                const parent2 = this.selectParent(population);

                for (let gi = 0; gi < parent1.getChromosomeLength(); gi++) {
                    if (0.5 > Math.random()) {
                        offspring.setGene(
                            gi,
                            parent1.getGene(gi));
                    } else {
                        offspring.setGene(
                            gi,
                            parent2.getGene(gi));
                    }
                }

                newPopulation.setIndividual(pi, offspring);
            } else {
                newPopulation.setIndividual(pi, parent1);
            }
        }

        return newPopulation;
    }
}

module.exports = GeneticAlgorithm;