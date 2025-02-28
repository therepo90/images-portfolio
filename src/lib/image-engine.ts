import { ShaderEngine } from './shader-engine';
import { ImageWebComponent } from './image-web-component';

export class ImageEngine extends ShaderEngine<ImageWebComponent> {
  private static swappingInputs: boolean = false;
  private defaultLaserTint = [1.0, 1.0, 1.0];
  private beamTarget?: {
    vy: number;
    vx: number;
    x: number;
    y: number;
  } = undefined;
  private laserTint = this.defaultLaserTint;

  private laserTintUniformLocation!: WebGLUniformLocation;
  private beamTargetUniformLocation!: WebGLUniformLocation;

  activate = () => {
    console.log('activate bg');

    this.loadTexture(
      this.gl,
      this.textures[0],
      this.texturePaths.iChannel0Path,
      1,
      this.preloadedImages.get(this.texturePaths.iChannel0Path),
    );
    let frame = 1;
    const draw = () => {
      try {
        const gl = this.gl;
        if (gl && this.textures) {
          gl.clearColor(0, 0, 0, 1);
          gl.clear(gl.COLOR_BUFFER_BIT);

          gl.uniform2f(this.mouseUniformLocation, this.mouse.x, this.mouse.y);
          gl.uniform1f(this.timeUniformLocation, (Date.now() - this.startTime) / 1000.0);
          gl.uniform3fv(this.laserTintUniformLocation, new Float32Array(this.laserTint)); // vec3(1.0, 0.5, 0.) *
          gl.uniform1i(this.frameUniformLocation, frame++); // vec3(1.0, 0.5, 0.) *
          if (this.beamTarget) {
            gl.uniform2f(this.beamTargetUniformLocation, this.beamTarget.x, this.beamTarget.y); // vec3(1.0, 0.5, 0.) *
          }

          // Bind textures
          gl.activeTexture(gl.TEXTURE0);
          gl.bindTexture(gl.TEXTURE_2D, this.textures[0]);
          gl.uniform1i(this.iChannel0UniformLocation, 0);

          gl.activeTexture(gl.TEXTURE1);
          gl.bindTexture(gl.TEXTURE_2D, this.textures[1]);
          gl.uniform1i(this.iChannel1UniformLocation, 1);

          gl.enable(gl.BLEND);
          gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
          gl.drawArrays(gl.TRIANGLES, 0, 6);
        }
      } catch (e) {
        console.error(e);
        alert(e);
      }
    };

    const animate = () => {
      this.updateBeamTarget();
      draw();
      requestAnimationFrame(animate);
    };

    animate();
  };
  override setupAdditionalUniforms(program: WebGLProgram) {
    const laserTintUniformLocation = this.gl.getUniformLocation(program, 'laserTint');
    const beamTargetUniformLocation = this.gl.getUniformLocation(program, 'beamTarget');
    this.laserTintUniformLocation = laserTintUniformLocation as any;
    this.beamTargetUniformLocation = beamTargetUniformLocation as any;
  }

  private updateBeamTarget() {
    const targetX = this.mouse.x;
    const targetY = this.mouse.y;

    if (!this.beamTarget) {
      this.beamTarget = { x: targetX - 50, y: targetY + 100, vx: 0, vy: 0 };
    }

    // Obliczamy różnicę w pozycji (X i Y)
    const dx = targetX - this.beamTarget.x;
    const dy = targetY - this.beamTarget.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // Przyciąganie do myszy
    const attractionStrength = 0.000005 * dist;
    this.beamTarget.vx += dx * attractionStrength;
    this.beamTarget.vy += dy * attractionStrength;

    // Dodanie efektu grawitacji (ciągłe opadanie w dół)
    const gravity = -0.65;
    this.beamTarget.vy += gravity;

    // Aktualizacja pozycji
    this.beamTarget.x += this.beamTarget.vx;
    this.beamTarget.y += this.beamTarget.vy;

    // Tłumienie prędkości (symulacja oporu powietrza)
    this.beamTarget.vx *= 0.95;
    this.beamTarget.vy *= 0.95;
  }
  /*
  public static changeLaserTint = (color: Vector3) => {
    this.laserTint = [color.x, color.y, color.z];
  }

  static swapInputs = async (inputs: { texturePaths: { iChannel1Path: string; iChannel0Path: string } }) => {//
    ImageWebComponent.swappingInputs = true;
    ImageWebComponent.texturePaths = inputs.texturePaths;
    console.log('Swapping inputs to ');
    console.log(ImageWebComponent.texturePaths, this, ImageWebComponent.textures);
    // a moze wyjeb poprzednie tekstury

    ImageWebComponent.loadTexture(ImageWebComponent.gl, ImageWebComponent.textures[0], ImageWebComponent.texturePaths.iChannel0Path, 0, ImageWebComponent.preloadedImages.get(ImageWebComponent.texturePaths.iChannel0Path));
    ImageWebComponent.loadTexture(ImageWebComponent.gl, ImageWebComponent.textures[1], ImageWebComponent.texturePaths.iChannel1Path, 1, ImageWebComponent.preloadedImages.get(ImageWebComponent.texturePaths.iChannel1Path));
    const delay = ms => new Promise(res => setTimeout(res, ms));
    await delay(17); // jak poczekac zeby nie rysowac poprzedniej ramki?
    ImageWebComponent.swappingInputs = false;
    //ImageWebComponent.gl.finish();
  }

  static deactivate() {
    const canvas = document.getElementById('rg-canvas-wrapper') as HTMLCanvasElement;
    canvas.style.position = 'absolute';
    canvas.style.left = '-9999px';
    canvas.style.top = '-9999px';
  }

  public static moveCanvas = (el: HTMLElement) => {
    const canvas = document.getElementById('rg-canvas-wrapper') as HTMLCanvasElement;
    console.log({canvas, shadowRoot: ImageWebComponent.shadowRoot, el});
    //move it with absolute position to el, calculate bounding rect
    canvas.style.position = 'absolute';
    const rect = el.getBoundingClientRect();
    canvas.style.left = (rect.left + window.scrollX) + 'px';
    canvas.style.top = (rect.top + window.scrollY) + 'px';
    console.log({canvas, rect})
  }*/
}
