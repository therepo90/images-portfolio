import {AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {ImageComponent} from "./image/image.component";
import {CommonModule} from "@angular/common";
import {defineRgImage, RgWebComponent} from "../lib/rg-web-component";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {BackgroundWebComponent, defineBgWeb, ProPlusShaderEngine} from "../lib/bg-web-component";

defineBgWeb()
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ImageComponent, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppComponent implements AfterViewInit{
  @ViewChild('rgImage') rgImage!: ElementRef<HTMLElement>;
  @ViewChild('bgproplus') bgproplus!: ElementRef<HTMLElement>;

  private shaderFragmentContent!: string;
  private vertexShaderContent!: string;
  private shaderFragmentTpl!: string;

  constructor(private http: HttpClient) {
  }
  bgImages = [{
    channelo0TexturePath: '/helmet.png',
  }];
  images = [
    /*{
      id: '1',
      shaderId: 'imgTransition1Shader',
      shaderMinNameAbbvPath: '/img1.shader',
      channelo0TexturePath: '/DSC_0031.jpg',
      channelo1TexturePath: '/DSC_0031_2.jpg',
      active: false,
    },
     {
       id: '2',
      shaderId: 'imgTransition2Shader',
      shaderMinNameAbbvPath: '/img1.shader',
      channelo0TexturePath: '/phone_followers.jpg',
      channelo1TexturePath: '/phone_followers2.jpg',
     active: false,
    },*/
    {
      id: '3',
      shaderId: 'imgTransition3Shader',
      shaderMinNameAbbvPath: '/img1.shader',
      channelo0TexturePath: '/troll.jpg', //
      channelo1TexturePath: '/troll2.jpg',
      active: false,
    },
   /* {
      id: '4',
      shaderId: 'imgTransition4Shader',
      shaderMinNameAbbvPath: '/img1.shader',
      channelo0TexturePath: '/full/DSC_0031.jpg',
      channelo1TexturePath: '/full/DSC_0031_2.jpg',
      active: false,
    }*/
  ];
  visibleCanvas: boolean = false;


  activate(imageId: string) {
    if(!this.visibleCanvas){
      RgWebComponent.activate();
    }
    this.visibleCanvas = true;
    this.images.forEach(image => {
      image.active = image.id === imageId;
    });
  }

  ngAfterViewInit(): void {
    this.startAsyncSheet().catch(e => {
      alert(e);
      throw e;
    });

  }

  private async initFuckingBgCanvas() {
    const base = window.origin.includes('localhost') ? '' : '/images-portfolio';
    console.log('Bejs',{base})
    this.shaderFragmentContent = await this.http.get(base+'/bg.shader.fragment.glsl', { responseType: 'text' }).toPromise() as any;
    this.vertexShaderContent = await this.http.get(base+'/vertex100.glsl', { responseType: 'text' }).toPromise() as any;
    this.shaderFragmentTpl = await this.http.get(base+'/fragment-main100.glsl', { responseType: 'text' }).toPromise() as any;
    let webel = this.bgproplus.nativeElement as BackgroundWebComponent;
    const engine = new ProPlusShaderEngine();
    await engine.init({
      shaderFragmentTpl: this.shaderFragmentTpl,
      shaderFragmentContent: this.shaderFragmentContent,
      vertexShaderContent: this.vertexShaderContent,
      webElement: webel
    });
    const toPreloadC0 = this.bgImages.map(textureInfo => textureInfo.channelo0TexturePath);
    await engine.preloadImages([...toPreloadC0]);
    await engine.setTexturePaths(
      {
        iChannel0Path: base + this.bgImages[0].channelo0TexturePath,
        iChannel1Path: ''
      },
    )
    await engine.activate();
  }

  private async initFuckingCanvas() {
    const base = window.origin.includes('localhost') ? '' : '/images-portfolio';
    console.log('Bejs',{base})
    this.shaderFragmentContent = await this.http.get(base+'/img1.shader.fragment.glsl', { responseType: 'text' }).toPromise() as any;
    this.vertexShaderContent = await this.http.get(base+'/vertex100.glsl', { responseType: 'text' }).toPromise() as any;
    let engineEl = this.rgImage.nativeElement as RgWebComponent;
    await engineEl.init({
      shaderFragmentContent: this.shaderFragmentContent,
      vertexShaderContent: this.vertexShaderContent,
    });
    const toPreloadC0 = this.images.map(textureInfo => textureInfo.channelo0TexturePath);
    const toPreloadC1 = this.images.map(textureInfo => textureInfo.channelo1TexturePath);
    await RgWebComponent.preloadImages([...toPreloadC0, ...toPreloadC1]);

  }

  deactivateAll() {
    console.log('out');
    this.visibleCanvas = false;
    this.images = this.images.map(i => ({
      ...i,
      active: false
    }));

  }
  deactivate(id: string) {
    console.log('out');
    this.visibleCanvas = false;
    this.images.forEach(image => {
      if(image.id === id){
        console.log('deactivated'+id);
        image.active = false;
      }
    });
  }
  private async startAsyncSheet() {
    await this.initFuckingCanvas();
    await this.initFuckingBgCanvas();
  }
}
