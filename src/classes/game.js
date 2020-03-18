import Matrix from './connect';

export default class Game {
  constructor(level) {
    this.level = level;
    this.xSize = level.xSize;
    this.ySize = level.ySize;

    this.gameObjects = level.gameObjects;
    this.groups = [];
    this.tick = 0;
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
    }
    return null;
  }

  getPosAtRange(x, y, range) {
    if (range == 1) {
      return [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]];
    }
    return null;
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

  countViruses(group) {
    var count = [0, 0];
    var counted = [];

    for (var i in group) {
      var adjacentPos = this.getPosAtRange(group[i][0], group[i][1], 1);

      for (var j in adjacentPos) {
        if (this.getObjectAtPos(adjacentPos[j][0], adjacentPos[j][1]) != null) {

          var targetObject = this.getObjectAtPos(adjacentPos[j][0], adjacentPos[j][1]);

          if (targetObject.type == 'Virus' && targetObject.owner == 0 && counted.indexOf(adjacentPos[j]) == -1) {

            count[0]++;
            counted.push(adjacentPos[j]);
          }
          else if (targetObject.type == 'Virus' && targetObject.owner == 1 && counted.indexOf(adjacentPos[j]) == -1) {

            count[1]++;
            counted.push(adjacentPos[j]);
          }
        }
      }
    }

    return count;
  }

  defineBridgeGroups() {
    var bridges = [];
    var groups = [];

    for (var i in this.gameObjects) {
      if (this.gameObjects[i].type == 'Bridge' && this.gameObjects[i].owner == 0 && this.gameObjects[i].builded == true) {
        bridges.push(this.gameObjects[i]);
      }
    }

    var matrix = new Matrix(this.xSize, this.ySize, bridges);
    groups.push(matrix.solve());

    bridges = [];

    for (var i in this.gameObjects) {
      if (this.gameObjects[i].type == 'Bridge' && this.gameObjects[i].owner == 1 && this.gameObjects[i].builded == true) {
        bridges.push(this.gameObjects[i]);
      }
    }

    var matrix = new Matrix(this.xSize, this.ySize, bridges);
    groups.push(matrix.solve());

    for (var i in groups) {
      for (var j in groups[i]) {
        groups[i][j].unshift(this.countViruses(groups[i][j]));
      }
    }

    this.groups = groups;
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
    this.defineBridgeGroups();
    this.tick++;
  }
}