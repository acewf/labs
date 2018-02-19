precision mediump float;

attribute vec3 aPosition;
attribute vec3 aNormal;
varying vec3 vNormal;
varying vec2 texCoord;

uniform mat4 uProjection;
uniform mat4 uModel;
uniform mat4 uView;

varying float intensity;
uniform float time;

void main() {
  mat4 modelViewMatrix = uView * uModel;
  vNormal = aNormal;
  vec3 modelNormal = normalize(vec3(0.0,0.0,-100.0) );
  vec3 cameraNormal = normalize( vec3(modelViewMatrix * vec4(aPosition,0.0)));

  float frequency = 100.0;
  float speed=0.003;
  float amplitude = 0.123;
    float p = 6.0;
  float c = 0.5;
  intensity = pow( c - dot(cameraNormal, modelNormal), p );

  float distortion = sin(aPosition.y * frequency + time * speed) * amplitude;
  vec3 newPosition = vec3(aPosition.x + distortion, aPosition.y, aPosition.z);
  texCoord = vec2(0.0,1.0)+vec2(0.5,-0.5) * (aPosition.xz + 1.0);
  gl_Position = uProjection * modelViewMatrix * vec4(newPosition, 1.0);
}
