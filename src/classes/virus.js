import Module from './module'

export default class Virus extends Module {
  constructor(x, y, owner) {
    super(x, y);
    this.maxIntegrity = 50;
    this.strength = 1;
    this.owner = owner;

    this.type = 'Virus';
    this.symbol = 'V';
  }
}