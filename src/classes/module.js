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
  }

  damage(pts) {
    this.integrityPts -= pts;
    if (this.integrityPts <= 0) {
      this.alive = false;
    }
  }

  nextTick() {
    if (this.builded == false) {
      this.integrityPts += 5;
      if (this.integrityPts >= this.maxIntegrity) {
        this.integrityPts = this.maxIntegrity;
        this.builded = true;
      }
    }
  }
}