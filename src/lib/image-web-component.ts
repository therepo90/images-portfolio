import { WebComponent } from './web-component';

export class ImageWebComponent extends WebComponent {
  constructor() {
    super('rg-web-component-canvas');
  }
}
export const defineImageWebComponent = () => {
  customElements.define('rg-image', ImageWebComponent);
};
