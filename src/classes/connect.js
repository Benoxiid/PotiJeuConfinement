export default class Matrix {
  constructor(n, m, bridges) {
    this.numrows = n;
    this.numcolumns = m;
    this.bridges = bridges;
    this.generateMatrix();
  }
  generateMatrix() {
    var rows = [];
    for (var j = 0; j < this.numrows; j++) {
      var columns = [];
      for (var i = 0; i < this.numcolumns; i++) {
        columns.push({
          val: 0,
          visited: false
        });
      }
      rows.push(columns);
    }

    for (var k in this.bridges) {
      rows[this.bridges[k].x][this.bridges[k].y].val = 1;
    }

    this.data = rows;
  }
  iterate(callback) {
    this.data.forEach(function (V, i) {
      V.forEach(function (U, j) {
        callback(U, i, j);
      });
    });
  }
  getData(i, j) {
    return this.data[i][j];
  }
  findConnectedNeighbour(i, j, collection) {
    // since we are visiting, i,j lets put visited true
    this.getData(i, j).visited = true;
    collection.push([i, j]);    //Left
    var canWeGoLeft =
      j - 1 >= 0 &&
      this.getData(i, j - 1).visited === false &&
      this.getData(i, j - 1).val === 1;
    if (canWeGoLeft) {
      this.findConnectedNeighbour(i, j - 1, collection);
    }    //Right
    var canWeGoRight =
      j + 1 <= this.numcolumns - 1 &&
      this.getData(i, j + 1).visited === false &&
      this.getData(i, j + 1).val === 1;
    if (canWeGoRight) {
      this.findConnectedNeighbour(i, j + 1, collection);
    }    //UP
    var canWeGoUp =
      i - 1 >= 0 &&
      this.getData(i - 1, j).visited === false &&
      this.getData(i - 1, j).val === 1;
    if (canWeGoUp) {
      this.findConnectedNeighbour(i - 1, j, collection);
    }    //Down
    var canWeGoDown =
      i + 1 <= this.numrows - 1 &&
      this.getData(i + 1, j).visited === false &&
      this.getData(i + 1, j).val === 1;
    if (canWeGoDown) {
      this.findConnectedNeighbour(i + 1, j, collection);
    }
  }
  solve() {
    var self = this;
    var allIsLands = [];
    this.iterate(function (cell, i, j) {
      if (cell.visited === false) {
        cell.visited = true;
        if (cell.val === 1) {
          var island = [];
          self.findConnectedNeighbour(i, j, island);
          allIsLands.push(island);
        }
      }
    });
    return allIsLands;
  }
}