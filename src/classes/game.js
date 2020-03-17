export default class Game {
  constructor(level) {
    this.level = level;
    this.xSize = level.xSize;
    this.ySize = level.ySize;

    this.gameObjects = level.gameObjects;
  }

  get currentBoard() {
    var output = '';
    for (var x = 0; x < this.xSize; x++) {
      for (var y = 0; y < this.ySize; y++) {
        var symbol = ' ';
        for (var i in this.gameObjects) {
          if (this.gameObjects[i].x == x && this.gameObjects[i].y == y) {
            symbol = this.gameObjects[i].symbol;
          }
        }
        output += '|' + symbol + '|';
      }
      output += '\n'
    }

    return output;
  }
}