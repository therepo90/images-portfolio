import {AfterViewInit, Component} from '@angular/core';
import {BabylonApp} from "./image";

@Component({
  selector: 'app-image',
  standalone: true,
  imports: [],
  templateUrl: './image.component.html',
  styleUrl: './image.component.scss'
})
export class ImageComponent implements AfterViewInit {

  ngAfterViewInit() {
    const canvas = document.getElementsByClassName('renderCanvas') as HTMLCanvasElement;
    const app = new BabylonApp(canvas);
    app.start();
  }
}
