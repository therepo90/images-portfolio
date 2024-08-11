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
export class ImageComponent implements AfterViewInit {
  @Input({required:false}) id?: string;
  @Input() shaderId: string = 'imgTransition1Shader';
  @Input() shaderMinNameAbbvPath: string = '/img1.shader';
  @Input() channelo0TexturePath: string = '/DSC_0031.jpg';
  @Input() channelo1TexturePath: string = '/DSC_0031_2.jpg';
  @Input() active: boolean = false;
  private afterViewInit: boolean = false;
  private wantsToInit: boolean = false;
  private shaderFragmentContent!: string;
  private vertexShaderContent!: string;

  constructor(private http: HttpClient, public el: ElementRef) {

  }


  @ViewChild('rgImage') rgImage!: ElementRef<HTMLElement>;
  public initialized: boolean = false;

  ngAfterViewInit() {
    this.afterViewInit = true;
    if(this.wantsToInit) {
      this.initApp().then(() => {
        this.wantsToInit = false;
      });
    }
    RgWebComponent.preloadImages([this.channelo0TexturePath, this.channelo1TexturePath]);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['active']?.currentValue === true) {
        this.initApp();
    }
  }

  private async initApp() {
    this.initialized = false;
    if(!this.afterViewInit) {
      this.wantsToInit = true;
      console.log('Delaying image init after view init.');
      return;
    }
    /*if(this.initialized) {
      return;
    }*/
    console.log('activating:'+this.id);
    //const canvas = this.renderCanvas.nativeElement; // require('../loaders/loader1/fragment.glsl')
    //const shaderFragmentContent = await this.http.get('/tmp.glsl', { responseType: 'text' }).toPromise() as any;
    this.shaderFragmentContent = this.shaderFragmentContent || await this.http.get('/img1.shader.fragment.glsl', { responseType: 'text' }).toPromise() as any;
    this.vertexShaderContent = this.vertexShaderContent || await this.http.get('/vertex.glsl', { responseType: 'text' }).toPromise() as any;

    if(RgWebComponent.initialized) {
      console.log('Moving shit');
      //move this.rgImage.nativeElement canvas to fixed:0


      await (this.rgImage.nativeElement as RgWebComponent).swapInputs(
        {
          texturePaths: {
            iChannel0Path: this.channelo0TexturePath,
            iChannel1Path: this.channelo1TexturePath
          }
        }
      );
      (this.rgImage.nativeElement as RgWebComponent).moveCanvas(this.el.nativeElement);

    }else {
      console.log('Initing shit');

      await (this.rgImage.nativeElement as RgWebComponent).init({
        shaderFragmentContent: this.shaderFragmentContent,
        vertexShaderContent: this.vertexShaderContent,
        texturePaths: {
          iChannel0Path: this.channelo0TexturePath,
          iChannel1Path: this.channelo1TexturePath
        }
      });
      (this.rgImage.nativeElement as RgWebComponent).moveCanvas(this.el.nativeElement);
      this.initialized = true;

    }
    this.initialized = true;
  }
}
