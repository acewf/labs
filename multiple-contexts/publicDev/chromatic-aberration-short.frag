#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

uniform sampler2D u_texture_0;
uniform vec2 u_texture_0Resolution;

uniform sampler2D u_texture_1;
uniform vec2 u_texture_1Resolution;

uniform sampler2D u_texture_2;
uniform vec2 u_texture_2Resolution;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
	float amount = 0.0;
	
	amount = (1.0 + sin(u_time*6.0)) * 0.5;
	amount *= 1.0 + sin(u_time*16.0) * 0.5;
	amount *= 1.0 + sin(u_time*19.0) * 0.5;
	amount *= 1.0 + sin(u_time*27.0) * 0.5;
	amount = pow(amount, 3.0);

	amount *= 0.05;
	
	vec3 col = vec3(1.0);;
	col.r = texture2D( u_texture_2, vec2(uv.x+amount,uv.y) ).r;
	col.g = texture2D( u_texture_2, uv ).g;
	col.b = texture2D( u_texture_2, vec2(uv.x-amount,uv.y) ).b;

	col *= (1.0 - amount * 0.5);
	
	
  gl_FragColor = vec4(col,1.0);
}
