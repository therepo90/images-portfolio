import {AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {ImageComponent} from "./image/image.component";
import {CommonModule} from "@angular/common";
import {RgWebComponent} from "../lib/rg-web-component";
import {HttpClient, HttpClientModule} from "@angular/common/http";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ImageComponent, HttpClientModule],
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
    }
  ];


  activate(imageId: string) {
    this.images.forEach(image => {
      image.active = image.id === imageId;
    });
  }

  ngAfterViewInit(): void {
    this.initFuckingCanvas();
  }

  private async initFuckingCanvas() {
    this.shaderFragmentContent = this.shaderFragmentContent || await this.http.get('/img1.shader.fragment.glsl', { responseType: 'text' }).toPromise() as any;
    this.vertexShaderContent = this.vertexShaderContent || await this.http.get('/vertex.glsl', { responseType: 'text' }).toPromise() as any;
    let engineEl = this.rgImage.nativeElement as RgWebComponent;
    await engineEl.init({
      shaderFragmentContent: this.shaderFragmentContent,
      vertexShaderContent: this.vertexShaderContent,
    });
    await RgWebComponent.preloadImages([this.images[0].channelo0TexturePath, this.images[0].channelo1TexturePath]);
    await engineEl.activate({
      texturePaths :{
        iChannel0Path: this.images[0].channelo0TexturePath,
        iChannel1Path: this.images[0].channelo1TexturePath
      }
    });
  }
}
