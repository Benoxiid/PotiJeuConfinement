import Module from './module'

export default class Bridge extends Module {
  constructor(x, y, owner) {
    super(x, y);

    this.owner = owner;
    this.conversionStatus = owner;
    this.bridgeGroup = -1;
    this.type = 'Bridge';
    this.symbol = '+';
    this.maxIntegrity = 20;
    this.used = false;
  }

  convert(value, owner) {
    if (owner == 0) {
      this.conversionStatus -= value;
      if (this.conversionStatus <= 0) {
        this.owner = 0;
        this.conversionStatus = 0;
      }
    }
    else {
      this.conversionStatus += value;
      if (this.conversionStatus >= 1) {
        this.owner = 1;
        this.conversionStatus = 1;
      }
    }
  }

  nextTick(build) {
    if (this.builded == false && build == true) {
      this.integrityPts += 5;
      if (this.integrityPts >= this.maxIntegrity) {
        this.integrityPts = this.maxIntegrity;
        this.builded = true;
      }
    }
    this.beingDamaged = false;
    this.used = false;
  }
}