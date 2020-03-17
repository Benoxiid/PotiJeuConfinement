// Benox's stuff !

import Game from './classes/game';
import Level from './classes/level';

var level = new Level();
var game = new Game(level);

console.log(game.currentBoard);

console.log(game.gameObjects);
for (var i = 0; i < 100; i++) {
  game.nextTick();
}
console.log(game.gameObjects);
console.log(game.defineBridgeGroups());