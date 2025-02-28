import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ResourceService {
  private base: string;
  //private imgDir = 'images';
  private shadersDir = 'shaders';

  constructor(private http: HttpClient) {
    this.base = window.origin.includes('localhost') ? '' : '/images-portfolio';
  }

  async loadShader(path: string) {
    path = path.startsWith('/') ? path.slice(1) : path;
    let dst = [this.base,this.shadersDir,path].join('/');
    console.log('Loading shader:', dst);
    return (await this.http
      .get(dst, { responseType: 'text' })
      .toPromise()) as any;
  }
}
