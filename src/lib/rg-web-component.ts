import { WebComponent } from './web-component';

export class RgWebComponent extends WebComponent {}
export const defineRgImage = () => {
  customElements.define('rg-image', RgWebComponent);
};
