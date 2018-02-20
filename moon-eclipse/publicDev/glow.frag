precision mediump float;

varying vec3 vNormal;
varying float intensity;
vec3 white = vec3(1.0,1.0,1.0);

uniform sampler2D texture;
varying vec2 texCoord;

void main() {
  vec3 glow = white * intensity;
  gl_FragColor = vec4( glow, glow.r);
  //gl_FragColor = texture2D(texture, texCoord);
}
