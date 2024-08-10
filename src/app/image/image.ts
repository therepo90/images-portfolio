import * as BABYLON from '@babylonjs/core';

export class BabylonApp {
  private canvas: HTMLCanvasElement;
  private engine: BABYLON.Engine;
  private scene: BABYLON.Scene;
  private postProcess: BABYLON.PostProcess;
  private mousePos: BABYLON.Vector2 = new BABYLON.Vector2(0, 0);
  private time: number = 0;

  private shaderId: string;
  private shaderMinNameAbbvPath: string;
  private channelo0TexturePath: string;
  private channelo1TexturePath: string;

  constructor(
    canvas: HTMLCanvasElement,
    shaderId: string = 'imgTransition1Shader',
    shaderMinNameAbbvPath: string = '/img1.shader',
    channelo0TexturePath: string = '/DSC_0031.jpg',
    channelo1TexturePath: string = '/DSC_0031_2.jpg'
  ) {
    this.canvas = canvas;
    this.shaderId = shaderId;
    this.shaderMinNameAbbvPath = shaderMinNameAbbvPath;
    this.channelo0TexturePath = channelo0TexturePath;
    this.channelo1TexturePath = channelo1TexturePath;

    this.engine = new BABYLON.Engine(this.canvas, true);
    this.scene = this.createScene();
    this.postProcess = this.createBgPostProcess();
  }

  private getResolution(): BABYLON.Vector2 {
    const c = this.scene.getEngine().getRenderingCanvas();
    return new BABYLON.Vector2(c.width, c.height);
  }

  private createBgPostProcess(): BABYLON.PostProcess {
    const postProcess = new BABYLON.PostProcess(
      this.shaderId,
      this.shaderMinNameAbbvPath,
      ['iResolution', 'iTime', 'iMouse'],
      ['iChannel0'],
      1.0,
      this.scene.activeCamera
    );

    const iChannel0 = new BABYLON.Texture(this.channelo0TexturePath, this.scene);
    const iChannel1 = new BABYLON.Texture(this.channelo1TexturePath, this.scene);

    document.addEventListener('mousemove', (e) => {
      this.mousePos = new BABYLON.Vector2(
        (e.pageX - this.canvas.offsetLeft),
        1.0 - (e.pageY - this.canvas.offsetTop)
      );
    });

    postProcess.onApply = (effect: any) => {
      this.time += 0.05;
      effect.setVector2('iResolution', this.getResolution());
      effect.setFloat('iTime', this.time);
      effect.setTexture('iChannel0', iChannel0);
      effect.setTexture('textureSampler', iChannel1);
      effect.setVector2('iMouse', this.mousePos);
    };

    return postProcess;
  }

  private createScene(): BABYLON.Scene {
    const scene = new BABYLON.Scene(this.engine);
    scene.clearColor = new BABYLON.Color4(0.0, 0, 0, 0);

    const camera = new BABYLON.UniversalCamera('UniversalCamera', new BABYLON.Vector3(0, 0, -1), scene);
    camera.setTarget(BABYLON.Vector3.Zero());
    scene.activeCamera = camera;

    return scene;
  }

  public start(): void {
    // Set up resize event and initial resize
    window.addEventListener('resize', () => {
      this.engine.resize();
    });
    setTimeout(() => this.engine.resize(), 10); // some bug with low quality texture

    // Run the render loop
    this.engine.runRenderLoop(() => {
      this.scene.render();
    });
  }

  public getEngine(): BABYLON.Engine {
    return this.engine;
  }

  public getScene(): BABYLON.Scene {
    return this.scene;
  }
}

