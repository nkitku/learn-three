import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Loop } from './loop';
import './style.css';

const loader = new GLTFLoader();
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  500
);

const renderer = new THREE.WebGLRenderer();
document.body.appendChild(renderer.domElement);

renderer.setSize(window.innerWidth, window.innerHeight);

// const geometry = new THREE.BoxGeometry(10, 0.2, 7);
// const material = new THREE.MeshStandardMaterial({ color: 0xff6347 });
// const torus = new THREE.Mesh(geometry, material);
// torus.position.setY(2);
// torus.position.setX(3);
// torus.position.setZ(3);
// scene.add(torus);

const pointLight = new THREE.PointLight(0xffffff);
const ambientLight = new THREE.AmbientLight(0xffffff);

pointLight.position.set(50, 20, 20);
scene.add(pointLight, ambientLight);
const pointLightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(pointLightHelper, gridHelper);

const controls = new OrbitControls(camera, renderer.domElement);
camera.position.setZ(30);
const loop = new Loop(camera, scene, renderer);

function setupModel(data) {
  const model = data.scene.children[0];
  const clip = data.animations[0];

  const mixer = new THREE.AnimationMixer(model);
  const action = mixer.clipAction(clip);
  action.play();

  model.tick = (delta) => mixer.update(delta);

  return model;
}

loader.load('./assets/Parrot.glb', (gltf) => {
  const parrot = setupModel(gltf);
  scene.add(parrot);
  loop.updatables.push(parrot);
  loop.start();
});

// function addStar() {
//   const geometry = new THREE.SphereGeometry(0.25, 24, 24);
//   const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
//   const star = new THREE.Mesh(geometry, material);

//   const [x, y, z] = Array(3)
//     .fill(0)
//     .map(() => THREE.MathUtils.randFloatSpread(100));

//   star.position.set(x, y, z);
//   scene.add(star);
// }

// Array(200).fill(0).forEach(addStar);

const spaceTexture = new THREE.TextureLoader().load(
  'https://raw.githubusercontent.com/fireship-io/threejs-scroll-animation-demo/main/space.jpg'
);
scene.background = spaceTexture;

// const moonTexture = new THREE.TextureLoader().load(
//   'https://raw.githubusercontent.com/fireship-io/threejs-scroll-animation-demo/main/moon.jpg'
// );
// const normalTexture = new THREE.TextureLoader().load(
//   'https://raw.githubusercontent.com/fireship-io/threejs-scroll-animation-demo/main/normal.jpg'
// );

// const moon = new THREE.Mesh(
//   new THREE.SphereGeometry(3, 32, 32),
//   new THREE.MeshStandardMaterial({
//     map: moonTexture,
//     normalMap: normalTexture,
//   })
// );

// scene.add(moon);

// moon.position.z = 30;
// moon.position.setX(-10);

function animate() {
  requestAnimationFrame(animate);
  // torus.rotation.x += 0.01;
  // torus.rotation.y += 0.005;
  // torus.rotation.z += 0.01;
  controls.update();
  renderer.render(scene, camera);
}

animate();

// import * as THREE from 'three';

// const scene = new THREE.Scene();
// const camera = new THREE.PerspectiveCamera( 100, window.innerWidth / window.innerHeight, 0.1, 2000 );

// const renderer = new THREE.WebGLRenderer();
// renderer.setSize( window.innerWidth, window.innerHeight );
// document.body.appendChild( renderer.domElement );
// const geometry = new THREE.TorusGeometry(10, 3, 16, 100)
// const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 ,wireframe:true} );
// const torus = new THREE.Mesh(geometry, material);
//  scene.add(torus);

//  camera.position.setZ(30)

// function animate() {
//   torus.rotation.x += 0.01;
//    torus.rotation.y += 0.005;
//    torus.rotation.z += 0.01;

//   renderer.render( scene, camera );
// }

// document.body.onscroll = () => {
//   animate()
//   console.log(document.body.offsetTop)
// }
