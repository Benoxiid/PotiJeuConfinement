// Benox's stuff !

import Game from './classes/game';
import Level from './classes/level';

var level = new Level();
var game = new Game(level);

console.log(game.currentBoard);