import GameObject from './gameObject'

export default class Module extends GameObject {
  constructor(x, y) {
    super(x, y);
    this.type = 'Module';
    this.symbol = 'M';
    this.integrityPts = 1;
    this.alive = true;
  }

  damage(pts) {
    this.integrityPts -= pts;
    if (this.integrityPts <= 0) {
      this.alive = false;
    }
  }
}