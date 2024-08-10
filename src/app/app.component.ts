import {AfterViewInit, Component} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {startStuff} from "./scene";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements AfterViewInit {
  title = 'images-portfolio';

  ngAfterViewInit() {
    const canvas = document.getElementById('renderCanvas') as HTMLCanvasElement;
    startStuff();
  }
}
