import {AfterViewInit, Component, Input} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {ImageComponent} from "./image/image.component";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ImageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
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
      channelo1TexturePath: '/phone_followers2.png',
     active: false,
    }
  ];

  activate(imageId: string) {
    this.images.forEach(image => {
      image.active = image.id === imageId;
    });
  }
}
