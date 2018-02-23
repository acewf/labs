import Geometry from 'gl-geometry';
import glShader from 'gl-shader';
import createTexture from 'gl-texture2d';
import normals from 'normals';
import { Sphere } from './geometries/sphere';
import { isDiff } from 'common';

import frag from './../publicDev/glow.frag';
import vert from './../publicDev/glow.vert';

const maxRotation = Math.PI * 2;
const velocity = 0.5;
const lightVelocity = 6;
const moonScaleMultipler = 0.5;

const inRangePercentage = (inMin, inMax, outMin, outMax) => (
    (input) => Math.min(outMax, Math.max((input - inMin) * (outMax - outMin) / (inMax - inMin) + outMin, outMin))
);
const normalizedRotation = inRangePercentage(0, maxRotation, -1, 1);

export default class Glow extends Geometry {
    constructor(gl, camera) {
        super(gl);
        this.uniforms = {};
        this.camera = camera;
        const sphere = new Sphere(5, 48, 48);

        const vertNormals = normals.vertexNormals(sphere.faces, sphere.vertices);
        this.attr('aPosition', sphere.vertices);
        this.attr('aNormal', vertNormals)
        this.faces(sphere.faces);

        this.shader = new glShader(this.gl, vert, frag);
        //this.bind(this.shader);
    }

    render = (now) => {
        /*
        var timer = Date.now() * 0.0001;
        const lightRotation = (timer * lightVelocity) % maxRotation;
        const normalRotation = 1 - Math.abs(normalizedRotation(lightRotation));
        const moonGlowIncrease = 0.25 * moonScaleMultipler;
        const lightGlow = 0.45+ moonScaleMultipler + (normalRotation * moonGlowIncrease);
        */
        this.bind(this.shader);
        this.shader.uniforms.uProjection = this.camera.projection;
        this.shader.uniforms.uView = this.camera.view;
        this.shader.uniforms.uModel = this.camera.model;
        this.shader.uniforms.time = now;
        this.shader.uniforms.scaleGlow = 1.2;
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