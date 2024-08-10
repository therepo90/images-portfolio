
import * as BABYLON from '@babylonjs/core';

let canvas;
const getResolution = (scene) => {
  const c = scene.getEngine().getRenderingCanvas();
  return new BABYLON.Vector2(c.width, c.height);
};

const createBgPostProcess = (scene: BABYLON.Scene, camera: BABYLON.Camera) => {
  const shaderId = 'imgTransition1Shader';
  const shaderMinNameAbbvPath = '/img1.shader';
  const channelo0TexturePath = '/DSC_0031.jpg';
  const channelo1TexturePath = '/DSC_0031_2.jpg';
  const postProcess = new BABYLON.PostProcess(shaderId, shaderMinNameAbbvPath, ['iResolution', 'iTime', 'iMouse'], ['iChannel0'], 1.0, camera);
  const iChannel0 = new BABYLON.Texture(channelo0TexturePath, scene);
  const iChannel1 = new BABYLON.Texture(channelo1TexturePath, scene);
  let mousePos = new BABYLON.Vector2(0, 0); // left-bottom of canvas is (0,0)
  document.addEventListener('mousemove', (e) => {
    mousePos = new BABYLON.Vector2((e.pageX - canvas.offsetLeft) , 1.0 - (e.pageY - canvas.offsetTop));
  });
  let time = 0;
  postProcess.onApply = (effect:any) => {
    time += 0.05;
    effect.setVector2('iResolution', getResolution(scene));
    effect.setFloat('iTime', time);
    effect.setTexture('iChannel0', iChannel0);
    effect.setTexture('textureSampler', iChannel1);
    effect.setVector2('iMouse', mousePos);
  };
  return postProcess;
};

const createScene = (engine) => {
  const scene = new BABYLON.Scene(engine);
  scene.clearColor = new BABYLON.Color4(0.0, 0, 0, 0);
  const camera = new BABYLON.UniversalCamera('UniversalCamera', new BABYLON.Vector3(0, 0, -1), scene);
  camera.setTarget(BABYLON.Vector3.Zero());
  const pgPostProcess = createBgPostProcess(scene, camera);

  return scene;
};

export function startStuff() {
  canvas = document.getElementById('renderCanvas') as any;
  const engine = new BABYLON.Engine(canvas, true);

  const scene = createScene(engine);

  engine.runRenderLoop(() => {
    scene.render();
  });

  window.addEventListener('resize', () => {
    engine.resize();
  });
  setTimeout(() => engine.resize(), 10); // some bug with low quality texture
}

