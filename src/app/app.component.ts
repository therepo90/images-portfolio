import {AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {ImageComponent} from "./image/image.component";
import {CommonModule} from "@angular/common";
import {RgWebComponent} from "../lib/rg-web-component";
import {HttpClient, HttpClientModule} from "@angular/common/http";

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

  private shaderFragmentContent!: string;
  private vertexShaderContent!: string;

  constructor(private http: HttpClient) {
  }
  images = [
    {
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
    },
    {
      id: '3',
      shaderId: 'imgTransition3Shader',
      shaderMinNameAbbvPath: '/img1.shader',
      channelo0TexturePath: '/troll.jpg',
      channelo1TexturePath: '/troll2.jpg',
      active: false,
    }
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
    this.initFuckingCanvas();
  }

  private async initFuckingCanvas() {
    const base = window.origin.includes('localhost') ? '' : '/images-portfolio';
    this.shaderFragmentContent = this.shaderFragmentContent || await this.http.get(base+'/img1.shader.fragment.glsl', { responseType: 'text' }).toPromise() as any;
    this.vertexShaderContent = this.vertexShaderContent || await this.http.get(base+'/vertex.glsl', { responseType: 'text' }).toPromise() as any;
    let engineEl = this.rgImage.nativeElement as RgWebComponent;
    await engineEl.init({
      shaderFragmentContent: this.shaderFragmentContent,
      vertexShaderContent: this.vertexShaderContent,
    });
    const toPreloadC0 = this.images.map(textureInfo => textureInfo.channelo0TexturePath);
    const toPreloadC1 = this.images.map(textureInfo => textureInfo.channelo1TexturePath);
    await RgWebComponent.preloadImages([...toPreloadC0, ...toPreloadC1]);
  }
}
