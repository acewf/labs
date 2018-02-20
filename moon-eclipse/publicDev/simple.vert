#ifdef GL_ES
precision mediump float;
#endif

attribute vec2 aTextureCoord;
varying highp vec2 vTextureCoord;

attribute vec3 a_position;

uniform mat4 uProjection;
uniform mat4 uModel;
uniform mat4 uView;

varying float intensity;

void main() {
    mat4 modelViewMatrix = uView * uModel;
    gl_Position = uProjection * modelViewMatrix * vec4(a_position, 1.0);
    //gl_Position = vec4(a_position, 1.0);
    vTextureCoord = gl_Position.xy;
    //vec3 newPosition = vec3(aPosition.x + 5.5, aPosition.y, aPosition.z);
    //gl_Position = uProjection * modelViewMatrix * vec4(a_position, 1.0);
}