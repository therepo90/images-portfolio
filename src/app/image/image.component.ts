import {AfterViewInit, Component, ElementRef, Input, SimpleChanges, ViewChild} from '@angular/core';
import {BabylonApp} from "./image";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-image',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image.component.html',
  styleUrl: './image.component.scss'
})
export class ImageComponent implements AfterViewInit {
  @Input({required:false}) id?: string;
  @Input() shaderId: string = 'imgTransition1Shader';
  @Input() shaderMinNameAbbvPath: string = '/img1.shader';
  @Input() channelo0TexturePath: string = '/DSC_0031.jpg';
  @Input() channelo1TexturePath: string = '/DSC_0031_2.jpg';
  @Input() active: boolean = false;


  @ViewChild('renderCanvas') renderCanvas!: ElementRef<HTMLCanvasElement>;
  private initialized: boolean = false;

  ngAfterViewInit() {

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['active']?.currentValue === true) {
        this.initApp();
    }
  }

  private initApp() {
    if(this.initialized) {
      return;
    }
    console.log('activating:'+this.id);
    const canvas = this.renderCanvas.nativeElement;
    const app = new BabylonApp(
      canvas,
      this.shaderId,
      this.shaderMinNameAbbvPath,
      this.channelo0TexturePath,
      this.channelo1TexturePath
    );
    app.start();
    this.initialized = true;
  }
}
