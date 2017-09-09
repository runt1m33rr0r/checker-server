class Individual {
    constructor(param) {
        this._chromosome = [];
        this._fitness = -1;

        if (typeof param === 'object') {
            this._initRandomOnTimetable(param);
        } else if (typeof param === 'number') {
            this._initRandomIndividual(param);
        } else if (Array.isArray(param)) {
            this._initByChromosome(param);
        } else {
            throw new Error('invalid individual param');
        }
    }

    _initRandomOnTimetable(timetable) {
        const newChromosome = [];
        let chromosomeIndex = 0;

        for (const group of timetable.getGroupsAsArray()) {
            for (const subjectId of group.getSubjectIds()) {
                newChromosome[chromosomeIndex] = timetable
                    .getRandomTimeslot()
                    .getTimeslotId();
                chromosomeIndex++;

                newChromosome[chromosomeIndex] = timetable
                    .getRandomRoom()
                    .getRoomId();
                chromosomeIndex++;

                newChromosome[chromosomeIndex] = timetable
                    .getSubjectById(subjectId)
                    .getRandomTeacherId();
                chromosomeIndex++;
            }
        }

        this._chromosome = newChromosome;
    }

    _initRandomIndividual(chromosomeLength) {
        const individ = [];
        for (let gene = 0; gene < chromosomeLength; gene++) {
            individ[gene] = gene;
        }
        this._chromosome = individ;
    }

    _initByChromosome(chromosome) {
        this._chromosome = chromosome;
    }

    getChromosome() {
        return this._chromosome;
    }

    getChromosomeLength() {
        return this._chromosome.length;
    }

    setGene(offset, gene) {
        this._chromosome[offset] = gene;
    }

    getGene(offset) {
        return this._chromosome[offset];
    }

    setFitness(fitness) {
        this._fitness = fitness;
    }

    getFitness() {
        return this._fitness;
    }

    toString() {
        let output = '';
        for (let gene = 0; gene < this._chromosome.length; gene++) {
            output += this._chromosome[gene] + ',';
        }
        return output;
    }

    containsGene(gene) {
        for (let i = 0; i < this._chromosome.length; i++) {
            if (this._chromosome[i] === gene) {
                return true;
            }
        }
        return false;
    }
}

module.exports = Individual;