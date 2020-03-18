import Module from './module'

export default class Core extends Module {
  constructor(x, y, owner, integrityPts) {
    super(x, y);

    this.owner = owner;
    this.type = 'Core';
    this.symbol = 'C';
    this.integrityPts = integrityPts;
    this.dataPts = 1000;
    this.builded = true;
  }
}