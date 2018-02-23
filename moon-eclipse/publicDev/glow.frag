precision mediump float;

varying vec3 vNormal;
varying float intensity;
vec3 white = vec3(1.0,1.0,1.0);

uniform sampler2D texture;
varying vec2 texCoord;

void main() {
  vec3 glow = white * intensity;
  //glow.r *= atan(10.0,texCoord.y);
  //glow.g *= atan(10.0,texCoord.y);
  //glow.b *= atan(10.0,texCoord.y);
  gl_FragColor = vec4( glow, glow.g);
  //gl_FragColor = texture2D(texture, texCoord);
}
