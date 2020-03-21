// Nami's stuff !
import './style/main.styl'
import GradientImg from './img/gradient.png'
import MonoFont from './fonts/Inconsolata_Regular.json'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { WebGLBufferRenderer, VertexColors } from 'three'
import Interface from './interface.js'

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

/**
 * Sizes
 */
const sizes = {}
sizes.width = window.innerWidth
sizes.height = window.innerHeight
sizes.ratio = sizes.width/sizes.height


/**
 * Scene
 */
const scene = new THREE.Scene()

var bgTexture = new THREE.TextureLoader().load(GradientImg);

bgTexture.magFilter = THREE.LinearFilter;
bgTexture.minFilter = THREE.LinearFilter;

scene.background = bgTexture;


/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({ alpha: false, antialias: true});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.toneMapping = THREE.ReinhardToneMapping;
document.body.appendChild(renderer.domElement);
renderer.setClearColor( 0xffffff, 0 );


/**
 * Camera
 */

const camera = new THREE.OrthographicCamera( - 40 * sizes.ratio, 40 * sizes.ratio, 40, - 40, 0, 1000 )
camera.position.set( 100, 120, 100 )
scene.add(camera)

/**
 * Camera Controls
 */
 const cameraControls = new OrbitControls(camera, renderer.domElement)
 cameraControls.zoomSpeed = 0.4
 cameraControls.enableDamping = true


/**
 * Rezise
 */
window.addEventListener('rezise', () =>
{
    sizes.widht = window.innerWidht
    sizes.height = window.innerHeight

    camera.aspect = sizes.widht / sizes.height
    camera.updateProjectionMatrix()

    renderer.setSize(sizes.width, sizes.height)
}
)

/**
 * Render Pass (for bloom)
 */
var renderScene = new RenderPass( scene, camera );

var bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
bloomPass.threshold = 0.1;
bloomPass.strength = 1;
bloomPass.radius = 0.0;

renderer.toneMappingExposure = (1);

var composer = new EffectComposer( renderer );
composer.addPass( renderScene );
composer.addPass( bloomPass );

/**
 * Raycasting for picking mouse events
 */
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

function onMouseMove( event ) {

	// calculate mouse position in normalized device coordinates
	// (-1 to +1) for both components

	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}

/**
 * HUD Stuff
 */


/**
 * Loop
 */

var event = new Event('rendering');

const loop = () =>
{
    window.requestAnimationFrame(loop)
    window.dispatchEvent(event)

    cameraControls.update()

    composer.render()
}

setInterval(function () {
    // console.log();
}, 1000);

window.addEventListener( 'mousemove', onMouseMove, false );

loop()




//-----------------------------------------------------------------------------------------------
/**
 *  START RENDERING GAME
 */
//-----------------------------------------------------------------------------------------------



var gridHelper = new THREE.GridHelper( 10, 10 );
// scene.add( gridHelper );

export default class Renderer {
    constructor() {
        this.gridMaterial = new THREE.MeshStandardMaterial({emissive: 0xffffff, wireframe: false});
        this.textMaterial = new THREE.MeshBasicMaterial({color: 0xffffff, wireframe: false});
        this.gridSquare = new THREE.BoxGeometry(8, 8, 1);
        this.gridGroup = new THREE.Group();
        this.lineMaterial = new THREE.LineBasicMaterial( { color: 0xffffff } );
        this.uiGroup = new THREE.Group();
        this.font;

        this.interface = new Interface();

        var loader = new THREE.FontLoader();

        this.font = loader.parse(MonoFont);

        scene.add(this.uiGroup);
    }

    uiLog(message) {
        this.interface.log(message);
    }

    uiWatch() {
        this.interface.watch(...arguments);
    }

    drawValue(x, y, value, id) {
        var points = [];
        var valueGroup = new THREE.Group();

        points.push(new THREE.Vector3(0, 0, 0));
        points.push(new THREE.Vector3(4, -4, 0));
        points.push(new THREE.Vector3(20, -4, 0));

        var lineGeometry = new THREE.BufferGeometry().setFromPoints(points);

        var line = new THREE.Line(lineGeometry, this.lineMaterial);

        var textGeometry = new THREE.TextGeometry( value, {
            font: this.font,
            size: 4,
            height: 0,
            curveSegments: 1
        } );

        var text = new THREE.Mesh(textGeometry, this.textMaterial);

        text.translateX(22);
        text.translateY(-5);

        valueGroup.add(text);
        valueGroup.add(line);
        valueGroup.userData = {
            type: 'note',
            x: x,
            y: y
        }

        valueGroup.name = id;
    
        if (this.uiGroup.getObjectByName(id) == null) {
            this.uiGroup.add(valueGroup);
        }
        else {
            var oldValueObject = this.uiGroup.getObjectByName(id);
            oldValueObject.children[0].geometry.dispose();
            oldValueObject.children[1].geometry.dispose();

            oldValueObject.children[0].geometry = valueGroup.children[0].geometry;
            oldValueObject.children[1].geometry = valueGroup.children[1].geometry;
        }

        // console.log(renderer.info.memory)
    }

    updateUIData() {
        for (var i = 0; i < this.uiGroup.children.length; i++) {
            if (this.uiGroup.children[i].userData.type = 'note') {
                var data = this.uiGroup.children[i].userData;
                var vector = new THREE.Vector3();
                vector.x = data.x * 10;
                vector.z = data.y * 10;
                vector.project(camera);

                vector.x *= -(- 40 * sizes.ratio - 40 * sizes.ratio);
                vector.y *= 80;
                vector.z = 0;

                this.uiGroup.children[i].position.lerp(vector, 1);
            }
        }
    }

    updateUI() {
        this.updateUIData();
        this.uiGroup.position.lerp(camera.position, 1);
        this.uiGroup.quaternion.copy(camera.quaternion);
        this.uiGroup.updateMatrix();
        this.uiGroup.translateZ(-1);
    }

    renderGrid(xSize, ySize) {

        for (var x = 0; x < xSize; x++) {
            for (var y = 0; y < ySize; y++) {
                var object = new THREE.Mesh(this.gridSquare, this.gridMaterial.clone()).rotateX(1.57).translateX(x * 10).translateY(y * 10);
                object.name = 'gridSquare:' + x + ':' + y;
                this.gridGroup.add(object);
            }
        }

        cameraControls.target = new THREE.Vector3((xSize * 5) - 5, 1, (ySize * 5) - 5);
        cameraControls.enablePan = false;
        cameraControls.enableZoom = false;

        camera.zoom = 0.5;
        camera.updateProjectionMatrix();

        scene.add(this.gridGroup);
    }

    getIntersections() {
        raycaster.setFromCamera(mouse, camera);

        var intersects = raycaster.intersectObjects(this.gridGroup.children);

        for ( var i = 0; i < intersects.length; i++ ) {
            intersects[i].object.material.emissive.set(0xffffff);
        }

        if (intersects.length > 0) {
            var splitedName = intersects[0].object.name.split(':');
            return [parseInt(splitedName[1]), parseInt(splitedName[2])];
        }
        else {
            return [];
        }
    }

    lerpColors() {
        for (var i = 0; i < this.gridGroup.children.length; i++) {
            if (this.gridGroup.children[i])
            this.gridGroup.children[i].material.emissive.lerp(new THREE.Color(0x101010), 0.2);
        }
    }

    flashPos(x, y, color) {
        var gridSquare = this.gridGroup.getObjectByName('gridSquare:' + x + ':' + y);
        gridSquare.material.emissive.set(color);
    }

    getColorAtPos(x, y) {
        var gridSquare = this.gridGroup.getObjectByName('gridSquare:' + x + ':' + y);
        return gridSquare.material.emissive;
    }
}