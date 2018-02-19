// Our vertex shader is run once for each of these
// vectors, to determine the final position of the vertex
// on the screen and pass data off to the fragment shader.

precision mediump float;


// Our attributes, i.e. the arrays of vectors in the bunny mesh.
attribute vec3 aPosition;
attribute vec3 aNormal;

// This is passed from here to be used in `bunny.frag`.
varying vec3 vNormal;

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

  // - `uProjection` will apply our perspective matrix, and
  // - `uView` will apply our camera transforms.
  // - `uModel` is unused here, but is traditionally used to
  //   move the object around the scene.
  float distortion = sin(aPosition.y * frequency + time * speed) * amplitude;
  vec3 newPosition = vec3(aPosition.x + distortion, aPosition.y, aPosition.z);
  gl_Position = uProjection * modelViewMatrix * vec4(newPosition, 1.0);
}
