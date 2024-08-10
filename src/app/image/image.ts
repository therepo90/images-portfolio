import {createRgLoader} from "../../lib/rg-web-component";

export class WebglApp {

  private shaderId: string;
  private shaderMinNameAbbvPath: string;
  private channelo0TexturePath: string;
  private channelo1TexturePath: string;
  private canvas: HTMLCanvasElement;
  private shaderCode: string;
  private shaderCodeTpl: string;

  constructor(
    canvas: HTMLCanvasElement,
    shaderId: string,
    shaderMinNameAbbvPath: string,
    channelo0TexturePath: string,
    channelo1TexturePath: string,
    shaderCode: string
  ) {
    this.canvas = canvas;
    this.shaderId = shaderId;
    this.shaderMinNameAbbvPath = shaderMinNameAbbvPath;
    this.channelo0TexturePath = channelo0TexturePath;
    this.channelo1TexturePath = channelo1TexturePath;
    this.shaderCode = shaderCode;
    this.shaderCodeTpl = `
            #version 100
        #ifdef GL_ES
        precision mediump float;
        #endif

        uniform vec2 iResolution;
        uniform float iTime; // seconds
        uniform vec2 iMouse;

        #include "fragment.glsl"

        void main()
        {
            mainImage(gl_FragColor, gl_FragCoord.xy);
        }
        `
  }
/*

  private getResolution(): BABYLON.Vector2 {
    const c = this.scene.getEngine().getRenderingCanvas() as HTMLCanvasElement;
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
*/
/*

  private createScene(): BABYLON.Scene {
    const scene = new BABYLON.Scene(this.engine);
    scene.clearColor = new BABYLON.Color4(0.0, 0, 0, 0);

    const camera = new BABYLON.UniversalCamera('UniversalCamera', new BABYLON.Vector3(0, 0, -1), scene);
    camera.setTarget(BABYLON.Vector3.Zero());
    scene.activeCamera = camera;

    return scene;
  }
*/

  public async start() {
    createRgLoader(this.shaderCodeTpl, this.shaderCode, 'rg-wgl-loader');
  }
}

