import GameObject from './gameObject'

export default class Module extends GameObject {
  constructor(x, y) {
    super(x, y);
    this.type = 'Module';
    this.symbol = 'M';
    this.integrityPts = 0;
    this.maxIntegrity = 1;
    this.alive = true;
    this.builded = false;
    this.beingDamaged = false;
  }

  damage(pts) {
    this.beingDamaged = true;
    this.integrityPts -= pts;
    if (this.integrityPts <= 0) {
      this.alive = false;
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
  }
}