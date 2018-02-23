#ifdef GL_ES
precision mediump float;
#endif

attribute vec2 aTextureCoord;
varying vec2 vUv;

attribute vec3 aPosition;

uniform mat4 uProjection;
uniform mat4 uModel;
uniform mat4 uView;

varying float intensity;

void main() {
    mat4 modelViewMatrix = uView * uModel;
    gl_Position = uProjection * modelViewMatrix * vec4(aPosition, 1.0);
    vUv = aPosition.xy;
}