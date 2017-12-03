attribute vec2 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat3 projectionMatrix;

varying vec2 vTextureCoord;

vec2 rand(vec2 co){
    return vec2(
        fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453),
        fract(cos(dot(co.yx ,vec2(8.64947,45.097))) * 43758.5453)
    )*2.0-1.0;
}

void main(void)
{
    //vec2 distort = rand(aVertexPosition.yx*5.0);
    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition*vec2(2.0), 1.0)).xy, 0.0, 1.0);
    vTextureCoord = aTextureCoord;
}