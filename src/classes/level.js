import Core from './core';
import Virus from './virus';
import Bridge from './bridge';

export default class Level {
  constructor() {
    this.xSize = 8;
    this.ySize = 8;

    this.gameObjects = [];

    this.dummyGrid();
  }

  dummyGrid() {
    
    /*for (var x = 1; x < this.xSize - 1; x++) {
      for (var y = 1; y < this.ySize - 1; y++) {
        this.gameObjects.push(new Bridge(x, y, Math.round(Math.random())));
      }
    }*/
    

    this.gameObjects.push(new Core(0, 0, 0, 200));
    this.gameObjects.push(new Core(this.xSize - 1, this.ySize - 1, 1, 200));

    //this.gameObjects.push(new Virus(this.xSize - 1, 0, 0));
    // this.gameObjects.push(new Bridge(this.xSize - 2, 0, 0));
    // this.gameObjects.push(new Bridge(this.xSize - 1, 1, 0));
    // this.gameObjects.push(new Virus(0, this.ySize - 8, 1));
    // this.gameObjects.push(new Virus(8, this.ySize - 1, 1));
  }
}