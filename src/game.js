// Benox's stuff !

import Game from './classes/game';
import Level from './classes/level';

var level = new Level();
var game = new Game(level);

console.log(game.currentBoard);

console.log(game.gameObjects);
console.time('100 gameTicks');
for (var i = 0; i < 100; i++) {
  game.nextTick();
}
console.timeEnd('100 gameTicks');
console.log('max 10 000 ms');
console.log(game.gameObjects);
console.log(game.groups);