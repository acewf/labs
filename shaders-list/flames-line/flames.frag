#ifdef GL_ES
precision highp float;
#endif
uniform vec2 u_resolution;
uniform float u_time;
uniform sampler2D uSampler;

varying vec2 vTextureCoord;
vec2 iResolution = vec2(200,200);
const vec2 fractrand = vec2(12.9,22.1);
const float fractmultip = 83758.5453;
const vec2 speed = vec2(1., 0.58);
float alpha = 1.0;
#define PI 3.14159265359

float rand(vec2 n) {
    return fract(sin(cos(dot(n, fractrand))) * fractmultip);
}

float noise(vec2 n) {
    const vec2 d = vec2(0.0, 1.0);
    vec2 b = floor(n), f = smoothstep(vec2(0.0), vec2(1.0), fract(n));
    return mix(mix(rand(b), rand(b + d.yx), f.x), mix(rand(b + d.xy), rand(b + d.yy), f.x), f.y);
}

float fractbrowianmotion(vec2 n) {
    float total = 0.0, amplitude = 1.000;
    for (int i = 0; i <5; i++) {
        total += noise(n) * amplitude;
        n += n*1.7;
        amplitude *= 0.47;
    }
    return total;
}

vec3 flames(vec2 r, vec2 p){
	float base = (r.y+r.y)* max(.0,p.y)-0.1;
 	vec3 color=vec3(1.0,.2,.05)/(pow(base, 4.0));
 	color = color/(10.0+max(vec3(0),color));
 	return color;
}
float wind(float time){
  return sin(time/2.0);
}

vec3 flamesBlock(float time, float dist, vec2 coord){
   vec2 p = coord * dist / iResolution.xy;
    p.x -= wind(time);
    float q = fractbrowianmotion(p - time * 0.+1.0*sin(time+0.5)/2.0);
    q = (q + q - .4 * q -1.0*q  + .6*q)/3.8;
    vec2 r = vec2(fractbrowianmotion(p + q /2.0 + time * speed.x - p.x - p.y), fractbrowianmotion(p + q - time * speed.y));

    vec3 color=flames(r,p);
    return color;
}

mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),sin(_angle),cos(_angle));
}

void main() {
    //vec4 img = texture2D(uSampler, vTextureCoord.xy);
	float dist = 3.9;//-sin(u_time*1.)/1.;
    vec2 coord = gl_FragCoord.xy;
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec3 _color = vec3(1.0);
    vec2 pointone = vec2(0.00,0.00);
    vec2 pointtwo= vec2(1.0,0.0);
    vec2 top_smoothstep_vec = smoothstep(pointone,pointtwo,st);
    float rotation = top_smoothstep_vec.x*PI/4.0;
    coord = rotate2d(rotation ) * coord;
    // bottom flames
    coord.y = coord.y-100.0;
    if(coord.y<0.1){
        coord.x = coord.x+1000.;
        dist = 7.9-sin(u_time*.4)/8.9;
        coord.xy = coord.xy*(-top_smoothstep_vec);
    }
    //_color +=vec3(coord.x,coord.y,0.00);
    _color = flamesBlock(u_time,dist,coord);
    //bvec3 black = lessThan(_color, vec3(0.1));

    gl_FragColor = vec4(_color.xyz, alpha);
}
