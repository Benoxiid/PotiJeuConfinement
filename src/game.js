// Benox's stuff !

import Game from './classes/game';
import Level from './classes/level';

var level = new Level();
var game = new Game(level);

console.log(game.currentBoard);

console.time('100 gameTicks');
console.log(game.gameObjects);
for (var i = 0; i < 1; i++) {
  game.nextTick();
  game.defineBridgeGroups();
}
console.timeEnd('100 gameTicks');
console.log(game.gameObjects);
console.log(game.groups);