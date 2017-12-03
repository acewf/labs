precision mediump float;
varying vec4 vColor;
uniform sampler2D uSampler;
varying float uTime;

void main(void)
{
  float coef = sin(gl_FragCoord.y*0.1+1*uTime);
  vTextureCoord.y  += coef*0.03;
  gl_FragColor = vColor*texture2D(uSampler, vTextureCoord);
}
