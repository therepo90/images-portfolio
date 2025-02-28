import { WebComponent } from './web-component';
import { InitParams } from './init-params';

export class ShaderEngine<T extends WebComponent> {
  protected shaderFragmentContent!: string;
  protected vertexShaderContent!: string;
  protected mouse!: { x: number; y: number };
  protected startTime!: number;
  protected texturePaths!: { iChannel1Path: string; iChannel0Path: string };
  protected initialized: boolean = false;
  protected gl!: WebGLRenderingContext;
  protected textures!: any[];
  protected mouseUniformLocation!: WebGLUniformLocation;
  protected timeUniformLocation!: WebGLUniformLocation;
  protected iChannel0UniformLocation!: WebGLUniformLocation;
  protected iChannel1UniformLocation!: WebGLUniformLocation;
  protected frameUniformLocation!: WebGLUniformLocation;
  protected webEl!: T;
  protected shadowRoot!: ShadowRoot;
  protected shaderFragmentTpl!: string;

  public preloadedImages = new Map<string, HTMLImageElement>();


  public preloadImages = async (paths: string[]) => {
    console.log('Preloading images', paths);
    const promises = paths.map((path) => {
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

  init = async (initParams: InitParams<T>) => {

    const { shaderFragmentTpl, shaderFragmentContent, vertexShaderContent, webElement } = initParams;
    this.webEl = webElement;
    this.shadowRoot = webElement.shadowRoot as ShadowRoot;
    if (!this.shadowRoot) {
      throw new Error('no shadow root');
    }

    const canvas = (webElement as T).getCanvas();
    if (!canvas) {
      throw new Error('no canvas dupa');
    }
    const wrapper = webElement;
    console.log('ShaderEngine::init', wrapper, initParams);
    this.vertexShaderContent = vertexShaderContent;
    this.shaderFragmentContent = shaderFragmentContent;
    this.shaderFragmentTpl = shaderFragmentTpl;

    this.mouse = { x: 0, y: 0 };
    this.startTime = Date.now();

    const parentWidth = wrapper.getBoundingClientRect().width;
    const parentHeight = wrapper.getBoundingClientRect().height;
    console.log('Rekt', { r: wrapper.getBoundingClientRect(), parentWidth, parentHeight });
    canvas.width = parentWidth;
    canvas.height = parentHeight;

    await this.setupWebGL().then(() => {
      this.setupMouseListeners();
    });
    this.initialized = true;
    console.log('Initialized engine');
  };

  loadTexture = (gl, texture: WebGLTexture, path: string, unit: number, image: any) => {
    if(!image) {
      console.error('No image ');
      alert('No image ')
      throw new Error('No image ');
    }
    console.log('ShaderEngine::loadTexture', { gl, texture, path, unit, image, width: image.width, height: image.height, imageData: image.data });
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
  };


  setupWebGL = async () => {
    console.log('setupWebGL');
    //debugger;
    const canvas = this.webEl.getCanvas();
    const gl = canvas.getContext('webgl');
    this.gl = gl as any;

    if (!gl) {
      alert('Unable to initialize WebGL. Your browser may not support it.');
      return;
    }

    let fragmentTpl = this.shaderFragmentTpl;
    // replace #include "fragment.glsl" with the actual content of fragment.glsl
    const fragmentShaderSource = fragmentTpl.replace('#include "fragment.glsl"', this.shaderFragmentContent);

    const vertexShaderSource = this.vertexShaderContent;
    //const fragmentShaderSource = this.shaderFragmentContent;

    console.log({ vertexShaderSource, fragmentShaderSource });

    // Compile shaders
    const vertexShader = this.compileShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = this.compileShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    if (!vertexShader || !fragmentShader) {
      console.error('Shader compilation failed.');
      alert('Shader compilation failed.');
      return;
    }

    // Link shaders into a program
    const program = this.createProgram(gl, vertexShader, fragmentShader);

    if (!program) {
      console.error('Shader program linking failed.');
      alert('Shader program linking failed.');
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
      0,
      1, // Top-Left
      0,
      0, // Bottom-Left
      1,
      0, // Bottom-Right
      0,
      1, // Top-Left
      1,
      0, // Bottom-Right
      1,
      1, // Top-Right
    ]);
    gl.bufferData(gl.ARRAY_BUFFER, textureCoordinates, gl.STATIC_DRAW);

    const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
    if (positionAttributeLocation === -1) {
      console.error('Unable to get attribute location for a_position');
      alert('Unable to get attribute location for a_position');
      return;
    }

    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

    // Set texture coordinates (UV) attribute
    const uvAttributeLocation = gl.getAttribLocation(program, 'a_uv');
    if (uvAttributeLocation === -1) {
      console.warn('Unable to get attribute location for a_uv'); // mb not used
      //alert('Unable to get attribute location for a_uv'+'(bg wc), but thats fine')
      //return;
    } else {
      gl.enableVertexAttribArray(uvAttributeLocation);
      gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
      gl.vertexAttribPointer(uvAttributeLocation, 2, gl.FLOAT, false, 0, 0);
    }

    const resolutionUniformLocation = gl.getUniformLocation(program, 'iResolution');
    const mouseUniformLocation = gl.getUniformLocation(program, 'iMouse');
    const timeUniformLocation = gl.getUniformLocation(program, 'iTime');
    const iChannel0UniformLocation = gl.getUniformLocation(program, 'iChannel0');
    const iChannel1UniformLocation = gl.getUniformLocation(program, 'iChannel1');
    const frameUniformLocation = gl.getUniformLocation(program, 'iFrame');

    this.mouseUniformLocation = mouseUniformLocation as any;
    this.timeUniformLocation = timeUniformLocation as any;
    this.iChannel0UniformLocation = iChannel0UniformLocation as any;
    this.iChannel1UniformLocation = iChannel1UniformLocation as any;
    this.frameUniformLocation = frameUniformLocation as any;
    this.setupAdditionalUniforms(program);

    gl.useProgram(program);
    console.log({
      resolutionUniformLocation,
      mouseUniformLocation,
      timeUniformLocation,
      iChannel0UniformLocation,
      iChannel1UniformLocation,
    });
    /*if (resolutionUniformLocation === null) {
      console.error('Unable to get required uniform location(s) - compiler might strip them if not used.');
      return;
    }*/

    gl.uniform2f(resolutionUniformLocation, canvas.width, canvas.height);
    this.textures = [gl.createTexture(), gl.createTexture()] as any[];

    console.log('WebGL initialized.');
    //this.beamTarget.x = this.mouse.x - 50;
    //this.beamTarget.y = this.mouse.y + 50;
  };

  compileShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error(`Error compiling shader: ${gl.getShaderInfoLog(shader)}`);
      alert(`Error compiling shader: ${gl.getShaderInfoLog(shader)}`);
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
      alert(`Unable to initialize the shader program: ${gl.getProgramInfoLog(program)}`);
      return null;
    }

    return program;
  };

  setupMouseListeners = () => {
    const canvas = this.webEl.getCanvas();

    document.addEventListener('mousemove', (event) => {
      const rect = canvas!.getBoundingClientRect();
      this.mouse.x = event.clientX - rect.left;
      this.mouse.y = rect.height - (event.clientY - rect.top);
    });
    canvas.addEventListener(
      'touchmove',
      (event) => {
        event.preventDefault();
        const rect = canvas!.getBoundingClientRect();
        //if(event.touches[0]) {
        this.mouse.x = event.touches[0].clientX - rect.left;
        this.mouse.y = rect.height - (event.touches[0].clientY - rect.top); //
        //}
      },
      { passive: false },
    );
  };


  protected setupAdditionalUniforms(program: WebGLProgram) {}
}
