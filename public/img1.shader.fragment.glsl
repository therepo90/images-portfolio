#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUV;
uniform sampler2D textureSampler;
uniform sampler2D iChannel0;
uniform vec2 iMouse;
uniform vec2 iResolution;
uniform float iTime;

vec2 mod2(vec2 p, float d) {
  float a = mod(p.x,d);
  float b = mod(p.y,d);
  return vec2(a,b);
}



vec3 laserTex(vec2 uv, vec2 mouse) {

  //uv*=0.1;
  vec3 col=vec3(0);
  float thk=0.03;
  vec3 barCol=vec3(0,1.0,1.0);
  float edgeCloseFactor = smoothstep(mouse.x-thk,mouse.x,uv.x);
  float barFactor = edgeCloseFactor* smoothstep(mouse.x+thk,mouse.x, uv.x);
  col=vec3(barFactor);
  return col;

}

vec3 laserComposition(vec2 uv, vec2 mouse) {

  vec3 laserMask = laserTex(uv,mouse);
  vec3 laserCol = vec3(1.0, 0.5, 0.);
  return laserMask.x * laserCol *2.;
  //return laserMask;

}

vec2 hash( in vec2 x )  // replace this by something better
{
  const vec2 k = vec2( 0.3183099, 0.3678794 );
  x = x*k + k.yx;
  return -1.0 + 2.0*fract( 16.0 * k*fract( x.x*x.y*(x.x+x.y)) );
}


// return gradient noise (in x) and its derivatives (in yz)
vec3 noised( in vec2 p )
{
  vec2 i = floor( p );
  vec2 f = fract( p );

  #if 1
  // quintic interpolation
  vec2 u = f*f*f*(f*(f*6.0-15.0)+10.0);
  vec2 du = 30.0*f*f*(f*(f-2.0)+1.0);
  #else
  // cubic interpolation
  vec2 u = f*f*(3.0-2.0*f);
  vec2 du = 6.0*f*(1.0-f);
  #endif

  vec2 ga = hash( i + vec2(0.0,0.0) );
  vec2 gb = hash( i + vec2(1.0,0.0) );
  vec2 gc = hash( i + vec2(0.0,1.0) );
  vec2 gd = hash( i + vec2(1.0,1.0) );

  float va = dot( ga, f - vec2(0.0,0.0) );
  float vb = dot( gb, f - vec2(1.0,0.0) );
  float vc = dot( gc, f - vec2(0.0,1.0) );
  float vd = dot( gd, f - vec2(1.0,1.0) );

  return vec3( va + u.x*(vb-va) + u.y*(vc-va) + u.x*u.y*(va-vb-vc+vd),   // value
  ga + u.x*(gb-ga) + u.y*(gc-ga) + u.x*u.y*(ga-gb-gc+gd) +  // derivatives
  du * (u.yx*(va-vb-vc+vd) + vec2(vb,vc) - va));
}

void Unity_GradientNoise_float(vec2 UV, float Scale, out float Out)
{
  Out = noised(UV * Scale).x *0.5 + 0.5;
}

void Unity_Multiply_float2_float2(vec2 A, vec2 B, out vec2 Out)
{
  Out = A * B;
}

void Unity_TilingAndOffset_float(vec2 UV, vec2 Tiling, vec2 Offset, out vec2 Out)
{
  Out = UV * Tiling + Offset;
}

void Unity_Lerp_float4(vec4 A, vec4 B, vec4 T, out vec4 Out)
{
  Out = mix(A, B, T);
}

void mainImage(out vec4 fragColor, in vec2 fragCoord)
{

  vec2 mouse = iMouse.xy / iResolution.xy;
  if(mouse.x < 0.01) {
    // init
    mouse.x = 0.5;
  }

  vec2 uv = fragCoord/iResolution.xy;
  float asp = iResolution.y / iResolution.x;
  //uv.x/=asp;
  //mouse.x/=asp;

  vec2 timeF = vec2(0.06, 0);
  vec2 timeOffset = iTime * timeF;
  vec2 uvTiled;
  Unity_TilingAndOffset_float(uv, vec2 (1, 1), timeOffset, uvTiled);

  float gradientNoise;
  Unity_GradientNoise_float(uvTiled, 11., gradientNoise);

  float distortionAmount=0.1;
  vec4 lerpedValue;
  Unity_Lerp_float4(vec4(uv,0.,0.), vec4(gradientNoise),vec4(distortionAmount), lerpedValue);

  vec3 laserCol = laserComposition(lerpedValue.xy,mouse);

  //vec3 col = lerpedCol;

  //float edgeCloseFactor = smoothstep(mouse.x-thk-offset1-0.03,mouse.x-offset1,uv.x);
  //float barFactor = edgeCloseFactor* smoothstep(mouse.x+thk-offset1,mouse.x-offset1, uv.x);

  vec3 col1=texture(iChannel0, uv).xyz;
  vec3 col2=texture(textureSampler, uv).xyz;
  vec3 col;
  col=mix(col1,col2,step(mouse.x, lerpedValue.x));
  //col*=laserCol;
  col+=laserCol;
  //col=mix(col,laserCol,0.5);
  //col = laserTex(uv, mouse);
  //col = vec3(uvTiled,0.);
  //col = vec3(gradientNoise);
  //col = vec3(lerpedValue);

  // Output to screen
  //col=col2;//texture(iChannel1, uv).xyz;//
  fragColor = vec4(col,1.0);
}

void main()
{
    mainImage(gl_FragColor, vUV * iResolution.xy);
}
