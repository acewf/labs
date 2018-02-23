import Geometry from 'gl-geometry';
import glShader from 'gl-shader';
import createTexture from 'gl-texture2d';
import { Circle } from './geometries/circle';
import { isDiff } from 'common';
import vert from './../publicDev/moon.vert';
import frag from './../publicDev/moon.frag';

export default class Moon extends Geometry {
    constructor(gl, camera, image) {
        super(gl);
        this.time = 0; 
        this.uniforms = {};
        this.camera = camera;
        const circle = new Circle(5, 88);
        this.attr('aPosition', circle.vertices);
        this.faces(circle.faces);
        this.shader = new glShader(this.gl, vert, frag);
        this.bind(this.shader);
        this.addTexture(image);
    }

    addTexture = (image) => {
        this.texture = createTexture(this.gl, image);
        const width = 1000;
        const height = 500;
        this.uniform(this.shader.program, '2f', 'vec2', 'u_resolution', width, height);
        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture.handle);
        this.uniform(this.shader.program, '2f', 'vec2', 'u_tex0Resolution', image.width, image.height);
    }

    render = (now) => {
        let width = 500;
        let height = 600;
        this.bind(this.shader);
        this.uniform(this.shader.program, '2f', 'vec2', 'u_resolution', width, height);
        this.shader.uniforms.uProjection = this.camera.projection;
        this.shader.uniforms.uView = this.camera.view;
        this.shader.uniforms.uModel = this.camera.model;
        this.shader.uniforms.time = now;
        this.time +=10;
        this.draw(this.gl.TRIANGLES);
    }

    uniform = (program, method, type, name, ...value) => {
        this.uniforms[name] = this.uniforms[name] || {};
        let uniform = this.uniforms[name];
        let change = isDiff(uniform.value, value);
        if (change || this.change || uniform.location === undefined || uniform.value === undefined) {
            uniform.name = name;
            uniform.value = value;
            uniform.type = type;
            uniform.method = 'uniform' + method;
            uniform.location = this.gl.getUniformLocation(program, name);

            this.gl[uniform.method].apply(this.gl, [uniform.location].concat(uniform.value));
        }
    }
}