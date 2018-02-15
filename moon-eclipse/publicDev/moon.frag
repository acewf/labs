#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.1415926535
#define HALF_PI 1.57079632679

uniform vec2 u_resolution;
uniform float u_time;

uniform sampler2D u_tex0;
uniform vec2 u_tex0Resolution;

uniform sampler2D u_tex1;
uniform vec2 u_tex1Resolution;

vec3 white = vec3(1.0,1.0,1.0);
vec3 black = vec3(0.0,0.0,0.0);
float speedMoon = 0.02;
float speedSun = 0.25;

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

vec4 sphereTexture(in sampler2D _tex, in vec2 _uv) {
    vec2 st = sphereCoords(_uv, 1.0);

    float aspect = u_tex0Resolution.y/u_tex0Resolution.x;
    // moon from left to right
    st.x = fract(st.x*aspect - u_time*speedMoon);
    // moon from right to left
    // st.x = fract(st.x*aspect + u_time*speedMoon);

    return texture2D(_tex, st);
}
mat2 scale(vec2 _scale){
    return mat2(_scale.x,0.0,
                0.0,_scale.y);
}

vec2 random2(vec2 st){
    st = vec2( dot(st,vec2(127.1,311.7)),
              dot(st,vec2(269.5,183.3)) );
    return -1.0 + 2.0*fract(sin(st)*43758.5453123);
}

void main(){
    vec2 defaultSt = gl_FragCoord.xy/u_resolution.xy;
    vec2 st = defaultSt;
    vec3 color = vec3(1.0);
    float ratio = u_resolution.y/u_resolution.x;
    float scaleRatio = 5.5;

    if(ratio>0.9){
        scaleRatio = 3.0;
    }
    mat2 scaleInt = scale(vec2(1.0,1.0*ratio))*scaleRatio;
    st = scaleInt * st;
    st.x = (st.x + 0.5 - (scaleRatio/2.0));
    st.y = (st.y + 0.5 - (scaleRatio*ratio/2.0));
    
    // Calculate sun direction
    float sunTime = u_time*1.3;
    // sun from right to left
    //vec3 sunPos = normalize(vec3(cos(sunTime*speedSun-HALF_PI),0.0,sin(speedSun*sunTime-HALF_PI)));
    // sun from left to right
    vec3 sunPos =  normalize(vec3(sin(speedSun*sunTime-HALF_PI),0.0,cos(sunTime*speedSun-HALF_PI)));
    vec3 surface = normalize(sphereNormals(st)*2.0-1.0);

    color *= sphereTexture(u_tex0, st).rgb;
    // Add Shadows
    color *= dot(sunPos,surface);

    // Blend black the edge of the sphere
    float border = 0.05;
    float radius = 1.0-length( vec2(0.5)-(st) )*2.0;
    float smoothRadius = smoothstep(0.001,border,radius); 

    // White highlights
    //if(smoothRadius<border){
        st -=0.5;
        float pw = pow(length(st),3.0)*5.0;
        float invPosition = 1.0;//-length((1.0+sunPos.b)*.5);
        float outRadius = invPosition-pw;
        // with stars background
        //color = texture2D(u_tex1, defaultSt).rgb;
        // with black background
        color = black;
        //color = white*fract(sin(gl_FragCoord.x)*0.2);
        float multiplie = fract(cos(gl_FragCoord.x)*0.2)*fract(cos(gl_FragCoord.y)*0.2);
        color = white*outRadius*multiplie;
        //color = mix(color, white,0.0);
    //}

    gl_FragColor = vec4(color,1.0);
}
