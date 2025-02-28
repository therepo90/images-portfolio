import {TheImage} from "../app/theimg";

export interface InitParams<T> {
  webElement: T;
  images: TheImage[]
}

export interface ActivateParams {
  texturePaths: {
    iChannel0Path: string;
    iChannel1Path: string;
  };
}
