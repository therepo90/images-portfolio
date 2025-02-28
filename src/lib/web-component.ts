export class WebComponent extends HTMLElement {
  protected canvas!: HTMLCanvasElement;

  public getCanvas() {
    return this.canvas;
  }

  constructor(private canvasClass?: string) {
    super();
    this.attachShadow({mode: 'open'});
  }

  connectedCallback() {
    console.log('connectedCallback:' + this.constructor.name);
    this.shadowRoot!.innerHTML = `
    <style>
      :host { display: block; width: 100%; height: 100%; }
    </style>
  `;
    const canvas = this.ownerDocument.createElement('canvas');
    if(this.canvasClass) {
      canvas.classList.add(this.canvasClass);
    }
    this.shadowRoot!.appendChild(canvas);
    this.canvas = canvas;
    console.log({canvas, x: this})
  }
}
