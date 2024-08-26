
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
  vec2 uv = vUV;
  //uv.y-=0.5;
  //uv*=2.;
  vec4 col=texture2D(iChannel0, uv);
  fragColor = col;
  if(uv.x > 1. || uv.y > 1. || uv.x < 0. || uv.y < 0.){
    fragColor = vec4(1.,1.,1.,1.);
  }
}
