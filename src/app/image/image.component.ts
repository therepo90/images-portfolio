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
import {define, RgWebComponent} from "../../lib/rg-web-component";

define();
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
  constructor(private http: HttpClient, public el: ElementRef) {

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['active']?.currentValue === true) {
        this.initImageCanvas();
    }
  }

  private async initImageCanvas() {
    await RgWebComponent.swapInputs(
      {
        texturePaths: {
          iChannel0Path: this.channelo0TexturePath,
          iChannel1Path: this.channelo1TexturePath
        }
      }
    );
    /*const delay = ms => new Promise(res => setTimeout(res, ms));
    await delay(10);*/
    RgWebComponent.moveCanvas(this.el.nativeElement);
    this.ready = true;
  }
}
