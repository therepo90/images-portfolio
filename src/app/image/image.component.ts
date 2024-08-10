import {
  AfterViewInit,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  Input,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {WebglApp} from "./image";
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
export class ImageComponent implements AfterViewInit {
  @Input({required:false}) id?: string;
  @Input() shaderId: string = 'imgTransition1Shader';
  @Input() shaderMinNameAbbvPath: string = '/img1.shader';
  @Input() channelo0TexturePath: string = '/DSC_0031.jpg';
  @Input() channelo1TexturePath: string = '/DSC_0031_2.jpg';
  @Input() active: boolean = false;
  private afterViewInit: boolean = false;
  private wantsToInit: boolean = false;

  constructor(private http: HttpClient) {

  }


  @ViewChild('renderCanvas') renderCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('rgImage') rgImage!: ElementRef<HTMLElement>;
  private initialized: boolean = false;

  ngAfterViewInit() {
    this.afterViewInit = true;
    this.initApp().then(() => {
      this.wantsToInit = false;
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['active']?.currentValue === true) {
        this.initApp();
    }
  }

  private async initApp() {
    if(!this.afterViewInit) {
      this.wantsToInit = true;
      console.log('Delaying image init after view init.');
      return;
    }
    if(this.initialized) {
      return;
    }
    console.log('activating:'+this.id);
    //const canvas = this.renderCanvas.nativeElement; // require('../loaders/loader1/fragment.glsl')
    const fragmentCode = await this.http.get('/fragment.glsl', { responseType: 'text' }).toPromise();
    const fragmentCodeTpl = await this.http.get('/fragment-main.glsl', { responseType: 'text' }).toPromise();
    const vertexCodeTpl = await this.http.get('/vertex.glsl', { responseType: 'text' }).toPromise();

    //@ts-ignore
    await (this.rgImage.nativeElement as RgWebComponent).init(fragmentCodeTpl, fragmentCode, vertexCodeTpl);
    //await this.rgImage.nativeElement.init();
    /*const app = new WebglApp(
      canvas,
      this.shaderId,
      this.shaderMinNameAbbvPath,
      this.channelo0TexturePath,
      this.channelo1TexturePath,
      shaderCode as string,
      shaderCodeTpl as string,
      vertexCodeTpl as string
    );
    await app.start();*/
    this.initialized = true;
  }
}
