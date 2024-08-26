float PI=3.141592653589;
vec3 lineColor=vec3(1.,0.,0.);

float dstToLine(vec2 a, vec2 b, vec2 uv, out float t) {
  vec2 lineDir = b - a;
  vec2 perpendicular = vec2(-lineDir.y, lineDir.x);
  perpendicular = normalize(perpendicular);
  vec2 uvToStart = uv - a;
  float distanceToLine = abs(dot(uvToStart, perpendicular));

  // t is (0,1) - the amount how much of line uv gets covered(length, percent point at the line)
  t = dot(uvToStart, lineDir) / dot(lineDir, lineDir);
  return distanceToLine;
}
float line(vec2 a, vec2 b, vec2 uv, float w) { // all -1 to 1
  float t;
  float distanceToLine = dstToLine(a,b,uv, t);

  float edgeEnd = (w / 2.);
  float dstVal = smoothstep(0.,edgeEnd,distanceToLine);
  float val = smoothstep(0., .2, t) * (1.-smoothstep(0.8, 1.,t)) * (1.- dstVal);
  //val+=sin(t)*0.1;
  return val;
}


vec3 laser(vec2 a, vec2 b, vec2 uv, float w, vec3 inCol) { // all -1 to 1
  vec3 col;
  col+=line(a, b, uv, w * 0.2) * vec3(1.); // white at middle
  col+=line(a, b, uv, w* 0.3) * mix(vec3(1.),inCol, 0.5); // mix white and col
  col+=line(a, b, uv, w* 0.8) * mix(vec3(1.),inCol, 0.75); // mix white and col
  col+=line(a, b, uv, w) * inCol; // color at the end
  return col;
}

vec3 skewedLaser(vec2 center, vec2 target, vec2 uv, float w, vec3 inCol, float inWyg, float time, float offsetWyg) {
  float t;
  dstToLine(center, target, uv, t);
  vec2 changedUv = uv;
  float d = length(vec2(uv.x,uv.y)); // dist
  float alpha = atan(uv.y, uv.x); //-pi to pi, //angle

  vec2 pc = vec2(d, alpha); // polar coords holding (dist, angle)

  float sinVal = (sin(t*7.+time*3.+PI*3.)*0.3+cos(t*22.+time*3.+pc.y*2.)*.7)*0.4;
  sinVal+=pow(t,14.)*0.6;
  //sinVal+=cos(pc.y*17.+time*3.)*0.1;
  //float sinVal = cos(pc.x*17.+time*3.)*.025 ;
  //float sinVal = 0.;//sin(time*14.)*cos(time*13.)*.025 ;

  //changedUv+=sinVal;
  float q = -4.*(t-0.5)*(t-0.5)+1.; // quadrating fn with top at 0.5 and zeros at 0 and 1

  vec2 lineDir = target - center;
  vec2 perpendicular = vec2(-lineDir.y, lineDir.x);
  perpendicular = normalize(perpendicular);
  float wygVal = inWyg * length(lineDir);
  //float fancySinTime = (sin(time*8.) * 0.3 + cos(time*9.+0.2)*0.4 + sin(time*6.+3.)*0.2) * 0.9;
  float fancySinTime = sin(t*2.+time)*0.5 + cos(t*2.+time)*0.5;
  float moveVal = wygVal* fancySinTime;
  changedUv+=q*moveVal * perpendicular*sinVal;//+sinVal;
  changedUv+=q*perpendicular*offsetWyg;
  //changedUv+=sinVal;
  vec3 col = vec3(0.);
  col+=laser(center, target, changedUv, w, inCol);
  //col=vec3(sinVal*100.);

  //col=vec3(pc.y);
  return col;
}


#define OUT_N 3.0
#define IN_N 4.0

vec3 clusteredBeam(vec2 center, vec2 target, vec2 uv, float w, vec3 inCol, float offsetWyg, float time) {

  //float n = 4.;
  vec3 col=vec3(0.);
  for(float i=1.;i<=IN_N;i+=1.){
    col+=skewedLaser(center, target, uv, w, inCol*i*(1./IN_N),i*0.15, time*4.+i*14., offsetWyg);
  }
  return col;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
  vec2 uv = 2.0*(fragCoord-.5*iResolution.xy)/iResolution.xy; // -1, 1
  vec2 mouse = 2.0*(iMouse.xy-.5*iResolution.xy)/iResolution.xy;

  vec2 center = vec2(-0.66,-0.70);
  vec2 target=mouse;
  vec3 col = vec3(0.);

  float time = iTime*1.;
  float w = 0.2;
  //float n = 3.;
  float offsetWyg = .1;// * abs(sin(iTime*1.4));
  for(float i=-OUT_N/2.;i<OUT_N/2.;i+=1.){

    col+=clusteredBeam(center, target, uv, w, vec3(0.,0.2,0.8), i*offsetWyg,  iTime+ i *15.);
  }

  //col+=line(center, target, uv, 0.1) * vec3(1.); // white at middle
  //fragColor = vec4(col, 1.0);
  vec4 texCol=texture2D(iChannel0, vUV);
  float texAM = step(0.1, texCol.a);
  vec4 finalCol=mix(vec4(vec3(0.),0.0),texCol, texAM); // wez kolory z tex tylko jak jest jakas rozsadna alfa
  finalCol.xyz+=col;
  finalCol.a += step(0.001, col.r + col.g + col.b);
  //finalCol.xyz=vec3(step(0.01,texCol.a));
  //finalCol.a=1.0;
  /*if(col.r + col.g + col.b > 0.1 && texCol.a < 0.01){ // col.r + col.g + col.b > 0.1 &&
    finalCol.xyz = mix(col, texCol.xyz,0.9);
    //finalCol.xyz=vec3(1.0,0.0,0.0);
    //finalCol.a=1.0;
  }*/
  //if()
  //finalCol.a=0.;
  /*vec4 finalCol=vec4(0.);
  finalCol.a=1.;
  finalCol.xyz+=col;*/
 /* if(vUV.y > 0.5 && vUV.x < 0.3){
    finalCol.a = texCol.a;
  }else{
    finalCol.a = 1.;
  }*/
  // if any of col components is greater than 0 then set alpha to 1
  //finalCol.a = step(0.0, col.r + col.g + col.b + texCol.a);
  fragColor = finalCol;
}

