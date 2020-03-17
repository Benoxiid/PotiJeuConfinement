import './gameObject';

class Level {
  constructor() {
    this.xSize = 8;
    this.ySize = 8;

    this.gameObjects = [];

    this.gameObjects.push(new GameObject(0, 0));
  }
}