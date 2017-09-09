const Individual = require('./individual');

class Population {
    constructor(...params) {
        this._population = [];
        this._populationFitness = -1;

        const firstArg = params[0];
        const secondArg = params[1];

        if (params.length <= 1) {
            return;
        }

        if (typeof firstArg === 'number' &&
            typeof secondArg === 'object') {
            this._initByTimetable(firstArg, secondArg);
        } else if (
            typeof firstArg === 'number' &&
            typeof secondArg === 'number') {
            this._initByChromosomeLength(firstArg, secondArg);
        } else {
            throw new Error('Invalid population constructor params!');
        }
    }

    _initByTimetable(populationSize, timetable) {
        for (let individCount = 0;
            individCount < populationSize;
            individCount++) {
            this._population[individCount] = new Individual(timetable);
        }
    }

    _initByChromosomeLength(populationSize, chromosomeLength) {
        for (let individCount = 0;
            individCount < populationSize;
            individCount++) {
            this._population[individCount] = new Individual(chromosomeLength);
        }
    }

    getIndividuals() {
        return this._population;
    }

    getFittest(offset) {
        this._population.sort((o1, o2) => {
            if (o1.getFitness() > o2.getFitness()) {
                return -1;
            } else if (o1.getFitness() < o2.getFitness()) {
                return 1;
            }
            return 0;
        });

        return this._population[offset];
    }

    setPopulationFitness(fitness) {
        this._populationFitness = fitness;
    }

    getPopulationFitness() {
        return this._populationFitness;
    }

    getPopulationSize() {
        return this._population.length;
    }

    setIndividual(offset, individual) {
        this._population[offset] = individual;
        return this._population;
    }

    getIndividual(offset) {
        return this._population[offset];
    }

    shuffle() {
        for (let i = this._population.length - 1; i > 0; i--) {
            const index = Math.floor(Math.random() * this._population.length);
            const a = this._population[index];
            this._population[index] = this._population[i];
            this._population[i] = a;
        }
    }
}

module.exports = Population;