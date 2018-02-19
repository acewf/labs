uniform vec3 viewVector;
uniform float c;
uniform float p;
varying float intensity;
uniform float time;

void main() 
{
  vec3 vNormal = normalize( normalMatrix * normal );
  vec3 vNormel = normalize( normalMatrix * viewVector );
  intensity = pow( c - dot(vNormal, vNormel), p );
  float frequency = 100.0;
  float speed=0.003;
  float amplitude = 0.323;
  float distortion = sin(position.y * frequency + time * speed) * amplitude;
  // float distortion = sin(position.y * frequency) * amplitude;  
  vec3 newPosition = vec3(position.x + distortion, position.y, position.z);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
