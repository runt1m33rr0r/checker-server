class Individual {
  constructor(param) {
    this._chromosome = [];
    this._fitness = -1;

    if (typeof param === 'object') {
      this._initByRandomTimetable(param);
    } else if (typeof param === 'number') {
      this._initByRandomIndividual(param);
    } else if (Array.isArray(param)) {
      this._initByChromosome(param);
    } else {
      throw new Error('invalid individual param');
    }
  }

  _initByRandomTimetable(timetable) {
    const newChromosome = [];
    let chromosomeIndex = 0;

    /* eslint no-restricted-syntax: 0 */
    for (const group of timetable.getGroupsAsArray()) {
      for (const subjectId of group.getSubjectIds()) {
        newChromosome[chromosomeIndex] = timetable.getRandomTimeslot().getTimeslotId();
        chromosomeIndex += 1;

        newChromosome[chromosomeIndex] = timetable.getSubjectById(subjectId).getRandomTeacherId();
        chromosomeIndex += 1;
      }
    }

    this._chromosome = newChromosome;
  }

  _initByRandomIndividual(chromosomeLength) {
    const individ = [];
    for (let gene = 0; gene < chromosomeLength; gene += 1) {
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
    for (let gene = 0; gene < this._chromosome.length; gene += 1) {
      output += `${this._chromosome[gene]},`;
    }
    return output;
  }

  containsGene(gene) {
    for (let i = 0; i < this._chromosome.length; i += 1) {
      if (this._chromosome[i] === gene) {
        return true;
      }
    }
    return false;
  }
}

module.exports = Individual;
