import Module from './module'

export default class Bridge extends Module {
  constructor(x, y, owner) {
    super(x, y);

    this.owner = owner;
    this.conversionStatus = owner;
    this.bridgeGroup = -1;
    this.type = 'Bridge';
    this.symbol = '+';
    this.integrityPts = 20;
  }
}