import { WebComponent } from './web-component';

export class BackgroundWebComponent extends WebComponent {

}
export const defineBgWeb = () => {
  customElements.define('bg-web', BackgroundWebComponent);
};
