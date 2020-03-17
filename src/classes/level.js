import GameObject from './gameObject';
import Core from './core';
import Virus from './virus';
import Bridge from './bridge';

export default class Level {
  constructor() {
    this.xSize = 8;
    this.ySize = 8;

    this.gameObjects = [];

    this.gameObjects.push(new Core(0, 0, 0, 1000));
    this.gameObjects.push(new Virus(7, 7, 0));

    for (var i = 1; i < 7; i++) {
      for (var j = 0; j < 8; j++) {
        this.gameObjects.push(new Bridge(i, j, 0));
      }
    }
  }
}