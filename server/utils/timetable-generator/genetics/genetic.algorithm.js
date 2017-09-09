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

        for (let populationIndex = 0;
            populationIndex < population.getPopulationSize();
            populationIndex++) {
            const individual = population.getFittest(populationIndex);
            const randomIndividual = new Individual(timetable);

            for (let geneIndex = 0;
                geneIndex < individual.getChromosomeLength();
                geneIndex++) {
                if (populationIndex > this._elitismCount) {
                    if (this._mutationRate > Math.random()) {
                        individual.setGene(
                            geneIndex,
                            randomIndividual.getGene(geneIndex));
                    }
                }
            }

            newPopulation.setIndividual(populationIndex, individual);
        }

        return newPopulation;
    }

    crossoverPopulation(population) {
        const newPopulation = new Population(population.getPopulationSize());

        for (let populationIndex = 0;
            populationIndex < population.getPopulationSize();
            populationIndex++) {
            const parent1 = population.getFittest(populationIndex);

            if (this._crossoverRate > Math.random() &&
                populationIndex >= this._elitismCount) {
                const offspring = new Individual(parent1.getChromosomeLength());
                const parent2 = this.selectParent(population);

                for (let geneIndex = 0;
                    geneIndex < parent1.getChromosomeLength();
                    geneIndex++) {
                    if (0.5 > Math.random()) {
                        offspring.setGene(
                            geneIndex,
                            parent1.getGene(geneIndex));
                    } else {
                        offspring.setGene(
                            geneIndex,
                            parent2.getGene(geneIndex));
                    }
                }

                newPopulation.setIndividual(populationIndex, offspring);
            } else {
                newPopulation.setIndividual(populationIndex, parent1);
            }
        }

        return newPopulation;
    }
}

module.exports = GeneticAlgorithm;