// Nami's stuff !
import './style/main.styl'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { WebGLBufferRenderer } from 'three'

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

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer()
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(window.devicePixelRatio)
renderer.domElement
document.body.appendChild(renderer.domElement)


/**
 * Camera
 */

const camera = new THREE.OrthographicCamera( - 20 * sizes.ratio, 20 * sizes.ratio, 20, - 20, 1, 1000 )
camera.position.set( 20, 20, 20 )
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
 * Loop
 */
const loop = () =>
{
    window.requestAnimationFrame(loop)
    cameraControls.update()

    renderer.render(scene, camera)
}
loop()




//-----------------------------------------------------------------------------------------------
/**
 *  START RENDERING GAME
 */
//-----------------------------------------------------------------------------------------------

