import {
  AfterViewInit,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  Input,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {CommonModule} from "@angular/common";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {defineRgImage, RgWebComponent} from "../../lib/rg-web-component";
import {Vector3} from "@babylonjs/core";

defineRgImage();
@Component({
  selector: 'app-image',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './image.component.html',
  styleUrl: './image.component.scss',
  // add shadow component {name: 'rg-wgl-loader'}
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ImageComponent {
  @Input({required:false}) id?: string;
  @Input() shaderId: string = 'imgTransition1Shader';
  @Input() shaderMinNameAbbvPath: string = '/img1.shader';
  @Input() channelo0TexturePath: string = '/DSC_0031.jpg';
  @Input() channelo1TexturePath: string = '/DSC_0031_2.jpg';
  @Input() active: boolean = false;
  ready: boolean = false;
  base: string='';
  constructor(private http: HttpClient, public el: ElementRef) {
    this.base = window.origin.includes('localhost') ? '' : '/images-portfolio';
    console.log('baseii', this.base);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['active']?.currentValue === true) {
        this.initImageCanvas();
    }
    if (changes['active']?.currentValue === false) {
      console.log('deactivated'+this.id);
      this.ready = false;
    }
    RgWebComponent.deactivate();
  }

  private async initImageCanvas() {

    await RgWebComponent.swapInputs(
      {
        texturePaths: {
          iChannel0Path: this.base + this.channelo0TexturePath,
          iChannel1Path: this.base + this.channelo1TexturePath
        }
      }
    );
    //const delay = ms => new Promise(res => setTimeout(res, ms));
    //await delay(1000); // wait one frame?
    RgWebComponent.moveCanvas(this.el.nativeElement);
    const randomTint = new Vector3(Math.random(), Math.random(), Math.random());
    RgWebComponent.changeLaserTint(randomTint);
    this.ready = true;
  }
}
