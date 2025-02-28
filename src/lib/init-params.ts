export interface InitParams<T> {
  shaderFragmentTpl: string;
  shaderFragmentContent: string;
  vertexShaderContent: string;
  webElement: T;
}

export interface ActivateParams {
  texturePaths: {
    iChannel0Path: string;
    iChannel1Path: string;
  };
}
