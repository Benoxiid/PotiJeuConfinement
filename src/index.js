import './renderer';
import Renderer from './renderer';
import * as THREE from 'three';

// Benox's stuff ! ----------------------------------

import Game from './classes/game';
import Level from './classes/level';

var level = new Level();
var game = new Game(level);
var targetedCoords = [];
var watched = [];

/**
 * console.log(game.currentBoard);
 * 
 * console.time('100 gameTicks');
 * for (var i = 0; i < 100; i++) {
 *   game.nextTick();
 * }
 * console.timeEnd('100 gameTicks');
 * console.log('max 10 000 ms');
 * 
 * console.log(game.currentBoard);
 */

var renderer = new Renderer();
var colors = [0xff00ff, 0x2020ff]

renderer.renderGrid(game.xSize, game.ySize);

// console.log(game.currentBoard);

var rendererTick = 0;

setInterval(function(e) {
  renderer.lerpColors();
  rendererTick++;

  for (var x = 0; x < game.xSize; x++) {
    for (var y = 0; y < game.ySize; y++) {
      var object = game.getObjectAtPos(x, y);

      if (object != null) {
        var targetColor = new THREE.Color(0x000000);

        if (object.type == 'Bridge') {
          targetColor = new THREE.Color(colors[0]).lerp(new THREE.Color(colors[1]), object.conversionStatus);

          if (object.used == true) {
            targetColor = targetColor.lerp(new THREE.Color(0xffffff), Math.random());
          }
        }
        else {
          targetColor = new THREE.Color(colors[0]).lerp(new THREE.Color(colors[1]), object.owner)
        }

        renderer.flashPos(x, y, targetColor.multiplyScalar(object.integrityPts / object.maxIntegrity));

        if (rendererTick % 3 == 0 && (object.beingDamaged == true || (object.conversionStatus > 0 && object.conversionStatus < 1))) {
          renderer.flashPos(x, y, new THREE.Color(0xffffff).multiplyScalar((object.integrityPts / object.maxIntegrity) * 10));
        }
      }
    }
  }

  targetedCoords = renderer.getIntersections();
}, 20);

setInterval(function(e) {
  game.nextTick();
  
  for (var i = 0; i < game.gameObjects.length; i++) {
    var object = game.gameObjects[i];
    if (object.type != 'Bridge') {
      // renderer.drawValue(object.x, object.y, 'Intergrity: ' + object.integrityPts.toString(), object.type + object.owner);
      watched.push([object.type + object.owner, object.integrityPts.toString()]);
    }
  }

  watched.push(['DataPts0', game.getDataPts(0)]);
  watched.push(['DataPts1', game.getDataPts(1)]);
  renderer.uiWatch(...watched);
  watched = [];
}, 100)

window.addEventListener('click', function(e) {
  game.buildModule(...targetedCoords, 'Virus', 0);
});

window.addEventListener('contextmenu', function(e) {
  e.preventDefault();
  // game.unbuildModule(...targetedCoords, 0);
  game.buildModule(...targetedCoords, 'Virus', 1);
});

window.addEventListener('rendering', function (e) {
  renderer.updateUI();
});

renderer.uiLog('Test !');