precision mediump float;

#define HALF_PI 1.57079632679

attribute vec3 aPosition;
attribute vec3 aNormal;
varying vec3 vNormal;
varying vec2 texCoord;

uniform mat4 uProjection;
uniform mat4 uModel;
uniform mat4 uView;

varying float intensity;
uniform float time;
uniform float scaleGlow;

float speedSun = 0.5;
float frequency = 100.0;
float speed=0.003;
float amplitude = 0.123;
float p = 6.0;
float c = 0.5;

void main() {
  mat4 modelViewMatrix = uView * uModel;
  vNormal = aNormal;
  vec3 modelNormal = normalize(vec3(0.0,0.0,-1.0) );
  vec3 cameraNormal = normalize( vec3(modelViewMatrix * vec4(aPosition,0.0)));

  intensity = pow( c - dot(cameraNormal, modelNormal), p );

  float distortion = sin(aPosition.y * frequency + time * speed) * amplitude;
  float sunTime = time* 0.001;
  float z = (0.5+(cos(sunTime*speedSun-HALF_PI)*0.5))*.2;
  float x = (sin(speedSun*sunTime-HALF_PI)*0.5)*0.2;
  
  vec3 newPosition = vec3(aPosition.x + distortion, aPosition.y, aPosition.z);
  vec3 sunPos =  normalize(vec3(0.0,x,.5));
  newPosition.y = newPosition.y+(x*4.0);
  newPosition*=(1.0-z);

  //newPosition.y *= pow(newPosition.y,newPosition.x);
  //newPosition.y *= tan(aPosition.y);
  

  vec3 pos = sunPos*scaleGlow;
  newPosition = cross(pos, newPosition);//dot(sunPos,newPosition);
  texCoord = aPosition.xy;
  gl_Position = uProjection * modelViewMatrix * vec4(newPosition, 1.0);
}
