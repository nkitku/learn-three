import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Loop } from './loop';
import './style.css';

const wait = (x: number) => new Promise((r) => setTimeout(r, x, x));

const basePath = (url: string) =>
  'https://raw.githubusercontent.com/nkitku/learn-three/master' + url;

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

const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
const material = new THREE.MeshStandardMaterial({ color: 0xff6347 });
const torus = new THREE.Mesh(geometry, material);
torus.position.setY(2);
torus.position.setX(3);
torus.position.setZ(3);
scene.add(torus);

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

function setupModel(data: GLTF) {
  const model = data.scene.children[0];
  const clip = data.animations[0];
  const mixer = new THREE.AnimationMixer(model);
  const action = mixer.clipAction(clip);
  action.play();
  // model.tick = (delta: number) => mixer.update(delta);
  return model;
}

loader.load(basePath('/assets/Parrot.glb'), (gltf) => {
  const parrot = setupModel(gltf);
  scene.add(parrot);
  loop.updatables.push(parrot);
  // loop.start();
});

function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3)
    .fill(0)
    .map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  scene.add(star);
}

Array(200).fill(0).forEach(addStar);

const imageBase = (x) =>
  'https://raw.githubusercontent.com/fireship-io/threejs-scroll-animation-demo/main' +
  x;

const spaceTexture = new THREE.TextureLoader().load(imageBase('/space.jpg'));
const moonTexture = new THREE.TextureLoader().load(imageBase('/moon.jpg'));
const normalTexture = new THREE.TextureLoader().load(imageBase('/normal.jpg'));
scene.background = spaceTexture;

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({ map: moonTexture, normalMap: normalTexture })
);

scene.add(moon);

moon.position.z = 30;
moon.position.setX(-10);

function animate() {
  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;
  controls.update();
  renderer.render(scene, camera);
}

const main = async () => {
  while (true) {
    await wait(50);
    animate();
  }
};
main();
