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

  constructor(private http: HttpClient) {

  }


  @ViewChild('renderCanvas') renderCanvas!: ElementRef<HTMLCanvasElement>;
  private initialized: boolean = false;

  ngAfterViewInit() {

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['active']?.currentValue === true) {
        this.initApp();
    }
  }

  private async initApp() {
    if(this.initialized) {
      return;
    }
    console.log('activating:'+this.id);
    const canvas = this.renderCanvas.nativeElement; // require('../loaders/loader1/fragment.glsl')
    const shaderCode = await this.http.get('/fragment.glsl', { responseType: 'text' }).toPromise();
    //const shaderCodeTpl = await this.http.get('/fragment-main.glsl', { responseType: 'text' }).toPromise();
    const app = new WebglApp(
      canvas,
      this.shaderId,
      this.shaderMinNameAbbvPath,
      this.channelo0TexturePath,
      this.channelo1TexturePath,
      shaderCode as any,
    );
    await app.start();
    this.initialized = true;
  }
}
