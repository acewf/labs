#define MAX_OCTAVES 7
uniform vec2 u_resolution;

float map(float value,float min1,float max1,float min2,float max2){
return min2+(value-min1)*(max2-min2)/(max1-min1);
}

float random(in vec2 st){
return fract(sin(dot(st.xy,vec2(12.9898,78.233)))*43758.5453123);
}

float noise(in vec2 st){
    vec2 i=floor(st);
    vec2 f=fract(st);
    float a=random(i);
    float b=random(i+vec2(1.,.0));
    float c=random(i+vec2(.0,1.));
    float d=random(i+vec2(1.,1.));
    vec2 u=f*f*(3.-2.*f);
    return mix(a,b,u.x)+(c-a)*u.y*(1.-u.x)+(d-b)*u.x*u.y;
}
float fbm(in vec2 n,in float l){
    float v=.0;
    float lacunarity=2.;
    float a=.75;
    n*=l;
    for(int i=0;i0.;i–){
        y=i/(3.0*i)*m*(fbm(.2*m*coords*i,1./(3.0+i))-.75)+i*2./(3.0+i);
        pct=plot(st,y);
        color=mix(color,vec3(map(i,.0,3.0,colorA.r,colorB.r),map(i,.0,3.0,colorA.g,colorB.g),map(i,.0,3.0,colorA.b,colorB.b)),pct);
    }
    gl_FragColor=vec4(color,1.);
}