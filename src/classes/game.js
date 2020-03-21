import Matrix from './connect';
import * as PF from 'pathfinding';
import Bridge from './bridge';
import Virus from './virus'

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
        for (var i = 0; i < this.gameObjects.length; i++) {
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
    for (var i = 0; i < this.gameObjects.length; i++) {
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

  getCore(owner) {
    var core = this.gameObjects.find(function(element) {
      return element.type == 'Core' && element.owner == owner;
    })
    return core;
  }

  nextTickVirus(virus) {
    var targets = []

    for (var i = 0; i < this.groups[1 - virus.owner].length; i++) {
      for (var j = 0; j < this.groups[1 - virus.owner][i].length; j++) {
        if (this.groups[1 - virus.owner][i][j][2] == true) { // If bridge is a contact point
          targets.push([this.groups[1 - virus.owner][i][j][0], this.groups[1 - virus.owner][i][j][1]]);
        }
      }
    }
    
    for (var i = 0; i < this.gameObjects.length; i++) {
      if (this.gameObjects[i].type != 'Bridge' && this.gameObjects[i].type != 'BadBlock' && this.gameObjects[i].owner != virus.owner) { // If game object is opponent and not bad block and not a bridge
        targets.push([this.gameObjects[i].x, this.gameObjects[i].y]);
      }
      else if (this.gameObjects[i].type == 'Bridge' && this.gameObjects[i].conversionStatus > 0 && this.gameObjects[i].conversionStatus < 1) {
        targets.push([this.gameObjects[i].x, this.gameObjects[i].y]);
      }
    }

    var pathToTarget = this.findClosestByPath(virus.x, virus.y, targets, virus.owner);

    if (pathToTarget != undefined && pathToTarget.length > 0) {
      var target = this.getObjectAtPos(pathToTarget[pathToTarget.length - 1][0], pathToTarget[pathToTarget.length - 1][1]);

      for (var i = 1; i < pathToTarget.length - 1; i++) {
        var usedBridge = this.getObjectAtPos(pathToTarget[i][0], pathToTarget[i][1]);
        usedBridge.used = true;
      }

      if (target.type == 'Bridge') {
        target.convert(0.2, virus.owner);
      }
      else {
        target.damage(1);
        this.getCore(virus.owner).addDataPts(1);
      }
    }
  }

  findClosestByPath(sourceX, sourceY, targets, groupOwner) {
    var matrix = [];
    var bridgeGroups = this.groups[groupOwner];
    var paths = [];

    for (var x = 0; x < this.xSize; x++) {
      matrix.push([]);
      for (var y = 0; y < this.ySize; y++) {
        matrix[x].push(1);
      }
    }

    var grid = new PF.Grid(matrix);

    for (var j = 0; j < bridgeGroups.length; j++) {
      var bridgeGroup = bridgeGroups[j];

      for (var i = 0; i < bridgeGroup.length; i++) {
        grid.setWalkableAt(bridgeGroup[i][0], bridgeGroup[i][1], true);
      }
    }

    for (var i = 0; i < targets.length; i++) {
      grid.setWalkableAt(targets[i][0], targets[i][1], true);
    }

    grid.setWalkableAt(sourceX, sourceY);

    var finder = new PF.AStarFinder();

    for (var i = 0; i < targets.length; i++) {
      var searchGrid = grid.clone();

      paths.push(finder.findPath(sourceX, sourceY, targets[i][0], targets[i][1], searchGrid));
    }

    var self = this;

    var pathsLength = paths.map(function (x) {
      if (x.length == 0) {
        return 99999999;
      }
      else if (self.getObjectAtPos(...x[x.length - 1]).type == 'Virus') {
        return 0;
      }
      return x.length;
    });

    return paths[this.indexOfSmallest(pathsLength)];
  }

  indexOfSmallest(a) {
    var lowest = 0;
    for (var i = 1; i < a.length; i++) {
     if (a[i] < a[lowest]) lowest = i;
    }
    return lowest;
  }

  isPostitionInGroup(x, y, owner) {
    for (var i = 0; i < this.groups[owner].length; i++) {
      for (var j = 0; j < this.groups[owner][i].length; j++) {
        if (this.groups[owner][i][j][0] == x && this.groups[owner][i][j][1] == y) {
          return true;
        }
      }
    }
    return false;
  }

  findContactPoints() {
    for (var i = 0; i < this.groups.length; i++) {
      for (var j = 0; j < this.groups[i].length; j++) {
        for (var k = 0; k < this.groups[i][j].length; k++) {
          var adjacentPos = this.getPosAtRange(this.groups[i][j][k][0], this.groups[i][j][k][1], 1);

          for (var l = 0; l < adjacentPos.length; l++) {
            if (this.isPostitionInGroup(adjacentPos[l][0], adjacentPos[l][1], 1 - i) && this.groups[i][j][k].length < 3) {
              this.groups[i][j][k].push(true);
            }
          }

          if (this.groups[i][j][k].length < 3) {
            this.groups[i][j][k].push(false);
          }
        }
      }
    }
  }

  findCloseGroups(x, y, owner) {

    var adjacentPos = this.getPosAtRange(x, y, 1);
    var adjacentGroups = [];

    for (var i = 0; i < adjacentPos.length; i++) {
      for (var j = 0; j < this.groups[owner].length; j++) {
        for (var k = 0; k < this.groups[owner][j].length; k++) {
          if (adjacentPos[i][0] == this.groups[owner][j][k][0] && adjacentPos[i][1] == this.groups[owner][j][k][1]) {
            if (adjacentGroups.indexOf(j) == -1) {
              adjacentGroups.push(j);
            }
          }
        }
      }
    }

    return adjacentGroups;
  }
  
  countViruses(group) {
    var count = [0, 0];
    var counted = [];

    for (var i = 0; i < group.length; i++) {
      var adjacentPos = this.getPosAtRange(group[i][0], group[i][1], 1);

      for (var j = 0; j < adjacentPos.length; j++) {
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

    for (var i = 0; i < this.gameObjects.length; i++) {
      if (this.gameObjects[i].type == 'Bridge' && this.gameObjects[i].owner == 0 && this.gameObjects[i].builded == true) {
        bridges.push(this.gameObjects[i]);
      }
    }

    var matrix = new Matrix(this.xSize, this.ySize, bridges);
    groups.push(matrix.solve());

    bridges = [];

    for (var i = 0; i < this.gameObjects.length; i++) {
      if (this.gameObjects[i].type == 'Bridge' && this.gameObjects[i].owner == 1 && this.gameObjects[i].builded == true) {
        bridges.push(this.gameObjects[i]);
      }
    }

    var matrix = new Matrix(this.xSize, this.ySize, bridges);
    groups.push(matrix.solve());

    /*for (var i = 0; i < groups.length; i++) {
      for (var j = 0; j < groups[i].length; j++) {
        groups[i][j].unshift(this.countViruses(groups[i][j]));
      }
    }*/

    this.groups = groups;
    this.findContactPoints();
  }

  cleanDeadObjects() {
    for (var i = 0; i < this.gameObjects.length; i++) {
      if (this.gameObjects[i].alive == false) {
        this.gameObjects.splice(i, 1);
      }
    }
  }

  buildModule(x, y, moduleType, owner) {
    if (this.getObjectAtPos(x, y) == null) {
      if (moduleType == 'Bridge') {
        this.gameObjects.push(new Bridge(x, y, owner));
      }
      else if (moduleType == 'Virus') {
        this.gameObjects.push(new Virus(x, y, owner));
      }
    }
  }

  unbuildModule(x, y, owner) {
    module = this.getObjectAtPos(x, y);
    if (module != null && module.owner == owner) {
      module.alive = false;
    }
  }

  getDataPts(player) {
    return this.getCore(player).dataPts;
  }

  nextTick() {
    this.defineBridgeGroups();

    this.getCore(0).addDataPts(1);
    this.getCore(1).addDataPts(1);

    for (var i = 0; i < this.gameObjects.length; i++) {
      var build = true;
      if (this.gameObjects[i].builded == false) {
        build = this.getCore(this.gameObjects[i].owner).removeDataPts(1);
      }
      this.gameObjects[i].nextTick(build);
    }

    for (var i = 0; i < this.gameObjects.length; i++) {
      if (this.gameObjects[i].type == 'Core') {

      }
      else if (this.gameObjects[i].type == 'Virus' && this.gameObjects[i].builded == true) {
        this.nextTickVirus(this.gameObjects[i]);
      }
    }
    this.cleanDeadObjects();
    this.tick++;
  }
}