#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.1415926535
#define HALF_PI 1.57079632679

uniform vec2 u_resolution;
uniform float time;

uniform sampler2D u_tex0;
uniform vec2 u_tex0Resolution;

varying vec2 vUv;

float speedMoon = 0.05;
float speedSun = 0.5;

vec3 sphereNormals(in vec2 uv) {
    uv = fract(uv)*2.0-1.0;
    vec3 ret;
    ret.xy = sqrt(uv * uv) * sign(uv);
    ret.z = sqrt(abs(1.0 - dot(ret.xy,ret.xy)));
    ret = ret * 0.5 + 0.5;
    return mix(vec3(0.0), ret, smoothstep(1.0,0.98,dot(uv,uv)) );
}

vec2 sphereCoords(vec2 _st, float _scale){
    float maxFactor = sin(1.570796327);
    vec2 uv = vec2(0.0);
    vec2 xy = 2.0 * _st.xy - 1.0;
    float d = length(xy);
    if (d < (2.0-maxFactor)){
        d = length(xy * maxFactor);
        float z = sqrt(1.0 - d * d);
        float r = atan(d, z) / 3.1415926535 * _scale;
        float phi = atan(xy.y, xy.x);

        uv.x = r * cos(phi) + 0.5;
        uv.y = r * sin(phi) + 0.5;
    } else {
        uv = _st.xy;
    }
    return uv;
}

vec4 sphereTexture(in sampler2D _tex, in vec2 _uv, float sunTime) {
    vec2 st = sphereCoords(_uv, 1.0);
    float aspect = u_tex0Resolution.y/u_tex0Resolution.x;
    st.x = fract(st.x*aspect - sunTime*speedMoon);

    return texture2D(_tex, st);
}
mat2 scale(vec2 _scale){
    return mat2(_scale.x,0.0,
                0.0,_scale.y);
}


void main(){
    vec3 color = vec3(1.0);
    vec2 st = vUv*0.1;
    st.x += 0.5;
    st.y += 0.5; 

    float sunTime = time* 0.001;
    vec3 sunPos =  normalize(vec3(sin(speedSun*sunTime-HALF_PI),0.0,cos(sunTime*speedSun-HALF_PI)));
    vec3 surface = normalize(sphereNormals(st)*2.0-1.0);
    
    color *= sphereTexture(u_tex0, st,sunTime).rgb;
    color *= dot(sunPos,surface);

    gl_FragColor = vec4(color,1.0);

}
