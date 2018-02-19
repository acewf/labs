precision mediump float;

// Sets the color of the current fragment (pixel)
// to display the normal at the current position.
// Using `abs()` to prevent negative values, which
// would just end up being black.

varying vec3 vNormal;
varying float intensity;
vec3 white = vec3(1.0,1.0,1.0);

void main() {
  vec3 glow = white * intensity;
  gl_FragColor = vec4( glow, glow.r);
  // gl_FragColor = vec4(abs(vNormal), 1.0);
}
