interface InitParams {
  shaderFragmentTpl: string;
  shaderFragmentContent: string;
  vertexShaderContent: string;
  webElement: BackgroundWebComponent;
}

export class ProPlusShaderEngine {
  private shaderFragmentContent!: string;
  private vertexShaderContent!: string;
  private mouse!: { x: number; y: number };
  private startTime!: number;
  private texturePaths!: { iChannel1Path: string; iChannel0Path: string };
  public  initialized: boolean = false;
  private gl!: WebGLRenderingContext;
  private textures!: any[];
  private mouseUniformLocation!: WebGLUniformLocation;
  private timeUniformLocation!: WebGLUniformLocation;
  private iChannel0UniformLocation!: WebGLUniformLocation;
  private iChannel1UniformLocation!: WebGLUniformLocation;
  private webEl!: BackgroundWebComponent;
  private shadowRoot!: ShadowRoot;
  private shaderFragmentTpl!: string;

  public preloadedImages = new Map<string, HTMLImageElement>();

  private  laserTintUniformLocation!: WebGLUniformLocation;
  private frameUniformLocation!: WebGLUniformLocation;
  private  defaultLaserTint = [1.0, 1.0, 1.0];
  private  laserTint = this.defaultLaserTint;

  public preloadImages = async (paths: string[]) => {
    const base = window.origin.includes('localhost') ? '' : '/images-portfolio';
    console.log('Bejsss',{base})
    paths = paths.map(path => base + path);
    console.log('Preloading images', paths);
    const promises = paths.map(path => {
      return new Promise<HTMLImageElement>((resolve, reject) => {
        const image = new Image();

        image.onload = () => resolve(image);
        image.onerror = reject;
        image.src = path;
      });
    });

    const loadedImages = await Promise.all(promises);

    paths.forEach((path, i) => {
      this.preloadedImages.set(path, loadedImages[i]);
    });
  };

  init = async ({
                  shaderFragmentTpl,
                  shaderFragmentContent,
                  vertexShaderContent,
                  webElement
                }: InitParams) => {
    this.webEl = webElement;
    this.shadowRoot = webElement.shadowRoot as ShadowRoot;
    //debugger;
    if(!this.shadowRoot){
      throw new Error('no shadow root');
    }

    // add <canvas id="rg-web-component-canvas" width="${parentWidth}px" height="${parentHeight}px"></canvas> to document
    const canvas = (webElement as BackgroundWebComponent).getCanvas();
    if(!canvas){
      throw new Error('no canvas dupa');
    }
    //canvas.id = 'rg-web-component-canvas';
    //canvas.width = parentWidth; //parentWidth;
    //canvas.height = parentHeight;//parentHeight;
    //get rg-canvas-wrapper and put
    //const wrapper = document.getElementById('bg-canvas-wrapper') as any;
    const wrapper = webElement;
    //wrapper.appendChild(canvas);
    //console.log('Canvas created');

    console.log('init bg-component');
    this.vertexShaderContent = vertexShaderContent;
    this.shaderFragmentContent = shaderFragmentContent;
    this.shaderFragmentTpl = shaderFragmentTpl;

    this.mouse = { x: 0, y: 0 };
    this.startTime = Date.now();

    const parentWidth = wrapper.getBoundingClientRect().width;
    const parentHeight = wrapper.getBoundingClientRect().height;
    console.log('Rekt',{r: wrapper.getBoundingClientRect(), parentWidth, parentHeight});
    canvas.width = parentWidth;
    canvas.height = parentHeight;

    await this.setupWebGL()
      .then(() => {
      this.setupMouseListeners();
    });
    this.initialized = true;
    console.log('Initialized web component');
    /*await this.activate();
    console.log('activated');*/

  }


   loadTexture  = (gl, texture: WebGLTexture, path: string, unit: number, image: any) => {
    console.log('Duupa',{gl, texture, path, unit, image, a:   image.width, b: image.height, c: image.data})
    gl.activeTexture(gl[`TEXTURE${unit}`]);
    gl.bindTexture(gl.TEXTURE_2D, texture);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);


    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.bindTexture(gl.TEXTURE_2D, null as any);
  };


  setTexturePaths = (texturePaths: { iChannel1Path: string; iChannel0Path: string }) => {
    this.texturePaths = texturePaths;
  }
   activate =  () => {
    console.log('activate bg');

     this.loadTexture(this.gl, this.textures[0], this.texturePaths.iChannel0Path, 1, this.preloadedImages.get(this.texturePaths.iChannel0Path));
   let frame = 1;
    const draw = () => {
      try {
        const gl = this.gl;
        if(gl && this.textures) {
          gl.clearColor(0, 0, 0, 1);
          gl.clear(gl.COLOR_BUFFER_BIT);

          gl.uniform2f(this.mouseUniformLocation, this.mouse.x, this.mouse.y);
          gl.uniform1f(this.timeUniformLocation, (Date.now() - this.startTime) / 1000.0);
          gl.uniform3fv(this.laserTintUniformLocation, new Float32Array(this.laserTint)); // vec3(1.0, 0.5, 0.) *
          gl.uniform1i(this.frameUniformLocation, frame++); // vec3(1.0, 0.5, 0.) *

          // Bind textures
          gl.activeTexture(gl.TEXTURE0);
          gl.bindTexture(gl.TEXTURE_2D, this.textures[0]);
          gl.uniform1i(this.iChannel0UniformLocation, 0);

          gl.activeTexture(gl.TEXTURE1);
          gl.bindTexture(gl.TEXTURE_2D, this.textures[1]);
          gl.uniform1i(this.iChannel1UniformLocation, 1);

          gl.drawArrays(gl.TRIANGLES, 0, 6);
        }
      }catch(e){
        console.error(e);
      }
    };

    const animate = () => {
      draw();
      requestAnimationFrame(animate);
    };

    animate();
  }

  setupWebGL = async() => {
    console.log('setupWebGL');
    //debugger;
    const canvas = this.webEl.getCanvas();
    const gl = canvas.getContext('webgl');
    this.gl = gl as any;

    if (!gl) {
      alert('Unable to initialize WebGL2. Your browser may not support it.');
      return;
    }


    let fragmentTpl = this.shaderFragmentTpl;
    // replace #include "fragment.glsl" with the actual content of fragment.glsl
    const fragmentShaderSource = fragmentTpl.replace('#include "fragment.glsl"', this.shaderFragmentContent);

    const vertexShaderSource = this.vertexShaderContent;
    //const fragmentShaderSource = this.shaderFragmentContent;

    console.log({vertexShaderSource, fragmentShaderSource});

    // Compile shaders
    const vertexShader = this.compileShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader =  this.compileShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    if (!vertexShader || !fragmentShader) {
      console.error('Shader compilation failed.');
      return;
    }

    // Link shaders into a program
    const program = this.createProgram(gl, vertexShader, fragmentShader);

    if (!program) {
      console.error('Shader program linking failed.');
      return;
    }

    // Create buffer and set vertices
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const vertices = new Float32Array([-1, -1, -1, 1, 1, 1, -1, -1, 1, 1, 1, -1]);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    // Create buffer and set texture coordinates (UV)
    const uvBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
    const textureCoordinates = new Float32Array([
      0, 1, // Top-Left
      0, 0, // Bottom-Left
      1, 0, // Bottom-Right
      0, 1, // Top-Left
      1, 0, // Bottom-Right
      1, 1  // Top-Right
    ]);
    gl.bufferData(gl.ARRAY_BUFFER, textureCoordinates, gl.STATIC_DRAW);


    const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
    if (positionAttributeLocation === -1) {
      console.error('Unable to get attribute location for a_position');
      return;
    }

    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

    // Set texture coordinates (UV) attribute
    const uvAttributeLocation = gl.getAttribLocation(program, 'a_uv');
    if (uvAttributeLocation === -1) {
      console.error('Unable to get attribute location for a_uv');
      return;
    }

    gl.enableVertexAttribArray(uvAttributeLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
    gl.vertexAttribPointer(uvAttributeLocation, 2, gl.FLOAT, false, 0, 0);

    const resolutionUniformLocation = gl.getUniformLocation(program, 'iResolution');
    const mouseUniformLocation = gl.getUniformLocation(program, 'iMouse');
    const timeUniformLocation = gl.getUniformLocation(program, 'iTime');
    const iChannel0UniformLocation = gl.getUniformLocation(program, 'iChannel0');
    const iChannel1UniformLocation = gl.getUniformLocation(program, 'iChannel1');
    const laserTintUniformLocation = gl.getUniformLocation(program, 'laserTint');
    const frameUniformLocation = gl.getUniformLocation(program, 'iFrame');
    this.mouseUniformLocation = mouseUniformLocation as any;
    this.timeUniformLocation = timeUniformLocation as any;
    this.iChannel0UniformLocation = iChannel0UniformLocation as any
    this.iChannel1UniformLocation = iChannel1UniformLocation as any;
    this.laserTintUniformLocation = laserTintUniformLocation as any;
    this.frameUniformLocation = frameUniformLocation as any;



    gl.useProgram(program);
//
    // todo mouse/time fix
    console.log({resolutionUniformLocation, mouseUniformLocation, timeUniformLocation, iChannel0UniformLocation, iChannel1UniformLocation});
    /*if (resolutionUniformLocation === null) {
      console.error('Unable to get required uniform location(s) - compiler might strip them if not used.');
      return;
    }*/

    gl.uniform2f(resolutionUniformLocation, canvas.width, canvas.height);
    this.textures = [gl.createTexture(), gl.createTexture()] as any[];
  }



  compileShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error(`Error compiling shader: ${gl.getShaderInfoLog(shader)}`);
      gl.deleteShader(shader);
      return null;
    }

    return shader;
  }

  createProgram = (gl, vertexShader, fragmentShader) => {
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.validateProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(`Unable to initialize the shader program: ${gl.getProgramInfoLog(program)}`);
      return null;
    }

    return program;
  }

  setupMouseListeners = () => {
    const canvas = this.webEl.getCanvas();

    document.addEventListener('mousemove', (event) => {

      const rect = canvas!.getBoundingClientRect();
      this.mouse.x = event.clientX - rect.left;
      this.mouse.y = rect.height - (event.clientY - rect.top);
    });
    document.addEventListener('touchmove', (event) => {
      const rect = canvas!.getBoundingClientRect();
      if(event.touches[0]) {
        this.mouse.x = event.touches[0].clientX - rect.left;
        this.mouse.y = rect.height - (event.touches[0].clientX - rect.top);
      }
    });

  }

}


// mam sobie w htmlu web component:
//lifecycle:
// 1 )connected callback jak sie zainicjuje w dom. Tu nie robie nic w sumie. Musze ten element wziac i go zainicjowac skads.
// 2) A wiec wyciagne go z html i zrobie na nim init jak sie zrobic afterview. I tu moge stworzyc swoj silnik i go z nim zainicjowac

export class BackgroundWebComponent extends HTMLElement {
  private canvas!: HTMLCanvasElement;
  constructor() {
    super();
    this.attachShadow({mode: 'open'});
  }

  connectedCallback() {
    console.log('connectedCallback rg-web-component');

    this.shadowRoot!.innerHTML = `
    <style>
      :host { display: block; width: 100%; height: 100%; }
    </style>
  `;
    const canvas = this.ownerDocument.createElement('canvas');
    canvas.classList.add('bg-canvas');
    this.shadowRoot?.appendChild(canvas);
    //const dupa = this.shadowRoot?.querySelector('canvas');
    //console.log({dupa});
    this.canvas = canvas;
  }

  public getCanvas() {
    return this.canvas;
  }
}
export const defineBgWeb = () =>
{
  customElements.define('bg-pro-plus', BackgroundWebComponent);
}
