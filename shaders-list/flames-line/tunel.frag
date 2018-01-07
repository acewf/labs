#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

//GLOBAL_START
#include "../lib/circleSDF.glsl"
#include "../lib/fill.glsl"
#include "../lib/stroke.glsl"
//GLOBAL_END

mat3 yuv2rgb = mat3(1.0, 0.0, 1.13983,
                    1.0, -0.39465, -0.58060,
                    1.0, 2.03211, 0.0);

mat2 scale(vec2 _scale){
    return mat2(_scale.x,0.0,
                0.0,_scale.y);
}
float dist (vec2 st) {
    return length(st);
    // return dot(st,st);
    // return min(abs(st.x+st.y),abs(st.x-st.y));
    // return abs(st.x+st.y);
    // return abs(st.x)+abs(st.y);
    // return abs(st.x);
    // return min(dot(st,st),abs(st.x));
    // return min(shape(st, 6), abs(st.x)*3.1416);
    // return shape(st, 6);
}

void main() {
    vec3 color = vec3(0.);
    vec2 st = gl_FragCoord.xy/u_resolution;
    st = mix(vec2((st.x*u_resolution.x/u_resolution.y)-(u_resolution.x*.5-u_resolution.y*.5)/u_resolution.y,st.y), 
             vec2(st.x,st.y*(u_resolution.y/u_resolution.x)-(u_resolution.y*.5-u_resolution.x*.5)/u_resolution.x), 
             step(u_resolution.x,u_resolution.y));
    //START
    st -= .5;
    // st += sin(u_time*.1)*0.5;
    float rInv = 1./dist(st);
    float t = u_time * 1.5;
    float pct = fract(rInv*0.5+t*.5);
    // color = yuv2rgb * vec3(0.5, st.x, st.y);
    color += mix(color,vec3(1.0,0.990,1.0),pct)*stroke(.5, fract(rInv+t*.5), 0.7);
    // color += fill(circleSDF(st), .5);
    
    //END
    gl_FragColor = vec4(color,1.);
}