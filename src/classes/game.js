export default class Game {
  constructor(level) {
    this.level = level;
    this.xSize = level.xSize;
    this.ySize = level.ySize;

    this.gameObjects = level.gameObjects;
  }
}