

interface InitParams {
  shaderFragmentContent: string;
  vertexShaderContent: string;
  texturePaths: {
    iChannel0Path: string,
    iChannel1Path: string
  };
}

export class RgWebComponent extends HTMLElement {
  private static shaderFragmentContent: string;
  private static vertexShaderContent: string;
  private mouse!: { x: number; y: number };
  private startTime!: number;
  private static texturePaths: { iChannel1Path: string; iChannel0Path: string };
  public static initialized: boolean = false;
  private static gl: WebGLRenderingContext;
  private static textures: any[];

  constructor() {
    super();
    this.attachShadow({mode: 'open'});

  }

  init = ({
         shaderFragmentContent,
         vertexShaderContent,
         texturePaths
       }: InitParams) => {
    RgWebComponent.texturePaths = { iChannel0Path: texturePaths.iChannel0Path, iChannel1Path: texturePaths.iChannel1Path };
    // Calculate client width and height of this element
    const parentWidth = this.getBoundingClientRect().width;
    const parentHeight = this.getBoundingClientRect().height;
    console.log({this: this, r: this.getBoundingClientRect(), parentWidth, parentHeight});
    this.shadowRoot!.innerHTML = `
    <style>
      :host { display: block; width: 100%; height: 100%; }
    </style>

  `;
    // add <canvas id="rg-web-component-canvas" width="${parentWidth}px" height="${parentHeight}px"></canvas> to document
    const canvas = document.createElement('canvas');
    canvas.id = 'rg-web-component-canvas';
    canvas.width = parentWidth;
    canvas.height = parentHeight;
    document.body.appendChild(canvas);
    RgWebComponent.vertexShaderContent = vertexShaderContent;
    RgWebComponent.shaderFragmentContent = shaderFragmentContent;

    this.mouse = { x: 0, y: 0 };
    this.startTime = Date.now();

    this.setupWebGL().then(() => {
      this.setupMouseListeners();
    });
    RgWebComponent.initialized = true;

  }
  connectedCallback() {
    console.log('connectedCallback rg-web-component');
  }

  loadTexture  = (gl, texture: WebGLTexture, path: string, unit: number) => {
    gl.activeTexture(gl[`TEXTURE${unit}`]);
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Set texture parameters
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    const image = new Image();
    image.src = path;
    image.onload = () => {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      gl.bindTexture(gl.TEXTURE_2D, null as any);
    };
  };


  setupWebGL = async() => {
    //debugger;
    const canvas = document.getElementById('rg-web-component-canvas') as HTMLCanvasElement;//
    const gl = canvas.getContext('webgl');
    RgWebComponent.gl = gl as any;

    if (!gl) {
      console.error('Unable to initialize WebGL. Your browser may not support it.');
      return;
    }

    const vertexShaderSource = RgWebComponent.vertexShaderContent;
    const fragmentShaderSource = RgWebComponent.shaderFragmentContent;

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

    // Create and set up textures
    RgWebComponent.textures = [gl.createTexture(), gl.createTexture()] as any[];

    console.log('Dupa', {this: this, textures: RgWebComponent.textures, texturePaths: RgWebComponent.texturePaths});

    this.loadTexture(gl, RgWebComponent.textures[0], RgWebComponent.texturePaths.iChannel0Path, 0);
    this.loadTexture(gl, RgWebComponent.textures[1], RgWebComponent.texturePaths.iChannel1Path, 1);

    // Use program and set attributes and uniforms
    gl.useProgram(program);

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
//
    // todo mouse/time fix
    console.log({resolutionUniformLocation, mouseUniformLocation, timeUniformLocation, iChannel0UniformLocation, iChannel1UniformLocation});
    if (resolutionUniformLocation === null || iChannel0UniformLocation === null || iChannel1UniformLocation === null) {
      console.error('Unable to get uniform location(s)');
      return;
    }

    gl.uniform2f(resolutionUniformLocation, canvas.width, canvas.height);

    const draw = () => {
      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.uniform2f(mouseUniformLocation, this.mouse.x, this.mouse.y);
      gl.uniform1f(timeUniformLocation, (Date.now() - this.startTime) / 1000.0);

      // Bind textures
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, RgWebComponent.textures[0]);
      gl.uniform1i(iChannel0UniformLocation, 0);

      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, RgWebComponent.textures[1]);
      gl.uniform1i(iChannel1UniformLocation, 1);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };

    const animate = () => {
      draw();
      requestAnimationFrame(animate);
    };

    animate();
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

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(`Unable to initialize the shader program: ${gl.getProgramInfoLog(program)}`);
      return null;
    }

    return program;
  }

    setupMouseListeners = () => {
    const canvas = document.getElementById('rg-web-component-canvas');

    document.addEventListener('mousemove', (event) => {

      const rect = canvas!.getBoundingClientRect();
      this.mouse.x = event.clientX - rect.left;
      this.mouse.y = rect.height - (event.clientY - rect.top);
      //console.log(this.mouse);
    });

    /*document.addEventListener('touchmove', function(e) {
        event.preventDefault();
        const rect = canvas.getBoundingClientRect();
        this.mouse.x= e.touches[0].clientX - rect.left;
        this.mouse.y =rect.height-(e.touches[0].clientY - rect.top);
    });*/
  }

  public moveCanvas = (el: HTMLElement) => {
    const canvas = document.getElementById('rg-web-component-canvas') as HTMLCanvasElement;
    console.log({canvas, shadowRoot: this.shadowRoot, el});
    //move it with absolute position to el, calculate bounding rect
    canvas.style.position = 'absolute';
    const rect = el.getBoundingClientRect();
    canvas.style.left = rect.left + 'px';
    canvas.style.top = rect.top + 'px';
    console.log({canvas, rect})
  }

  swapInputs = (inputs: { texturePaths: { iChannel1Path: string; iChannel0Path: string } }) => {
    RgWebComponent.texturePaths = inputs.texturePaths;
    console.log('Swapping inputs');
    console.log(RgWebComponent.texturePaths, this, RgWebComponent.textures);
    this.loadTexture(RgWebComponent.gl, RgWebComponent.textures[0], RgWebComponent.texturePaths.iChannel0Path, 0);
    this.loadTexture(RgWebComponent.gl, RgWebComponent.textures[1], RgWebComponent.texturePaths.iChannel1Path, 1);
  }
}
export const define = () =>
{
  customElements.define('rg-image', RgWebComponent);
}
