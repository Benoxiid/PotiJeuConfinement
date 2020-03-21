import Module from './module'

export default class Core extends Module {
  constructor(x, y, owner, integrityPts) {
    super(x, y);

    this.owner = owner;
    this.type = 'Core';
    this.symbol = 'C';
    this.integrityPts = integrityPts;
    this.maxIntegrity = integrityPts;
    this.dataPts = 25;
    this.builded = true;
  }

  addDataPts(amount) {
    this.dataPts += amount;
  }

  removeDataPts(amount) {
    this.dataPts -= amount;
    if (this.dataPts < 0) {
      this.dataPts += amount;
      return false;
    }
    return true;
  }
}