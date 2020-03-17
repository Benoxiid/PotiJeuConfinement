import Matrix from './connect';

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

  getObjectAtPos(x, y) {
    for (var i in this.gameObjects) {
      if (this.gameObjects[i].x == x && this.gameObjects[i].y == y) {
        return this.gameObjects[i];
      }
      return null;
    }
  }

  getPosAtRange(x, y, range) {
    if (range == 1) {
      return [[x - 1, y], [x, y - 1], [x , y + 1], , [x + 1, y]];
    }
  }

  nextTickVirus(virus) {
    var adjacentPos = this.getPosAtRange(virus.x, virus.y, 1);

    for (var i in adjacentPos) {
      if (this.getObjectAtPos(adjacentPos[i][0], adjacentPos[i][1]) != null) {
        var targetObject = this.getObjectAtPos(adjacentPos[i][0], adjacentPos[i][1]);

        if (targetObject.type == 'Bridge') {

        }
        else if (targetObject.type == 'BadBlock') {

        }
        else {
          targetObject.damage(virus.strength);
        }
      }
    }
  }

  defineBridgeGroups() {
    var bridges = [];
    var groups = [];

    for (var i in this.gameObjects) {
      if (this.gameObjects[i].type == 'Bridge' && this.gameObjects[i].owner == 0) {
        bridges.push(this.gameObjects[i]);
      }
    }

    var matrix = new Matrix(this.xSize, this.ySize, bridges);
    groups.push(matrix.solve());

    return groups;
  }

  nextTick() {
    for (var i in this.gameObjects) {
      this.gameObjects[i].nextTick();

      if (this.gameObjects[i].type == 'Core') {

      }
      else if (this.gameObjects[i].type == 'Virus') {
        this.nextTickVirus(this.gameObjects[i]);
      }
    }
  }
}