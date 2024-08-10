export const createRgLoader = (fragmentCodeTemplate, fragmentCodeIncluded, htmlElementName) => {
    class RgWebComponent extends HTMLElement {
      private fragmentCodeTemplate!: string;
      private fragmentCodeIncluded!: string;
      private mouse!: { x: number; y: number };
      private startTime!: number;
        constructor() {
            super();
            this.attachShadow({mode: 'open'});
            this.fragmentCodeTemplate = fragmentCodeTemplate;
            this.fragmentCodeIncluded = fragmentCodeIncluded;
        }

        connectedCallback() {
            console.log('connected' + htmlElementName);

            // calculate client width and height of this element
            const parentWidth = this.getBoundingClientRect().width;
            const parentHeight = this.getBoundingClientRect().height;
            this.shadowRoot!.innerHTML = `
            <style>
                :host { display: block; width: 100%; height: 100%; }
            </style>
            <canvas id="rg-wgl-loader-canvas" width="${parentWidth}px" height="${parentHeight}px"></canvas>
        `;
            this.mouse = {x: 0, y: 0};
            this.startTime = Date.now();
            this.setupWebGL();
            this.setupMouseListeners();
        }

        setupWebGL() {
            const canvas = this.shadowRoot!.getElementById('rg-wgl-loader-canvas') as HTMLCanvasElement;
            const gl = canvas.getContext('webgl');

            if (!gl) {
                console.error('Unable to initialize WebGL. Your browser may not support it.');
                return;
            }

            let fragmentTpl = this.fragmentCodeTemplate;
            // replace #include "fragment.glsl" with the actual content of fragment.glsl
            const fragmentShaderCode = this.fragmentCodeIncluded;
            fragmentTpl = fragmentTpl.replace('#include "fragment.glsl"', fragmentShaderCode);
            //const vertexShaderSource = require('./vertex.glsl');
            const vertexShaderSource = `
                            attribute vec2 a_position;

                uniform vec2 iResolution;
                uniform float iTime; // seconds
                uniform vec2 iMouse;
                void main() {
                    gl_Position = vec4(a_position, 0, 1);
                }
                `;
            const fragmentShaderSource = fragmentTpl;

            // Compile shaders
            const vertexShader = this.compileShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
            const fragmentShader = this.compileShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

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

            const resolutionUniformLocation = gl.getUniformLocation(program, 'iResolution');
            const mouseUniformLocation = gl.getUniformLocation(program, 'iMouse');
            const timeUniformLocation = gl.getUniformLocation(program, 'iTime');

            if (resolutionUniformLocation === null || timeUniformLocation === null) {
                console.error('Unable to get uniform location(s)');
                return;
            }

            gl.uniform2f(resolutionUniformLocation, canvas.width, canvas.height);

            const draw = () => {
                gl.clearColor(0, 0, 0, 1);
                gl.clear(gl.COLOR_BUFFER_BIT);

                gl.uniform2f(mouseUniformLocation, this.mouse.x, this.mouse.y);
                gl.uniform1f(timeUniformLocation, (Date.now() - this.startTime) / 1000.0);

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

        createProgram(gl, vertexShader, fragmentShader) {
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

        setupMouseListeners() {
            const canvas = this.shadowRoot!.getElementById('rg-wgl-loader-canvas');

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
    }
    customElements.define(htmlElementName, RgWebComponent);
}

