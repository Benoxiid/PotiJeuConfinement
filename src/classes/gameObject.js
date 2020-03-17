export default class GameObject {
  constructor(x, y) {
    this.x = x;
    this.y = y;

    this.type = 'object';
    this.symbol = 'O';
  }

  nextTick() {
    return null;
  }
}