import 'index.css'
import Stats from 'stats-js';
import Geometry from 'gl-geometry';
import fit from 'canvas-fit';
import glShader from 'gl-shader';
import mat4 from 'gl-mat4';
import normals from 'normals';
import orbitCamera from 'canvas-orbit-camera';
import glContext from 'gl-context';
import createTexture from 'gl-texture2d';

import { isCanvasVisible, isDiff } from 'common';
import { SphereGeometry } from 'three/src/geometries/SphereGeometry';
import glowFrag from './../publicDev/glow.frag';
import glowVert from './../publicDev/glow.vert';

import simpleFrag from './../publicDev/simple.frag';
import simpleVert from './../publicDev/simple.vert';

import moonFrag from './../publicDev/moon.frag';

const projection = new mat4.create();
const model = new mat4.create();
const view = new mat4.create();

const projectionB = new mat4.create();
const modelB = new mat4.create();
const viewB = new mat4.create();

function convertThreeToNormalsArray(arr, faces) {
  var cells = [];
  for (let index = 0; index < arr.length; index++) {
    const element = arr[index];
    if (faces) {
      cells.push([element.a, element.b, element.c]);
    } else {
      cells.push([element.x, element.y, element.z]);
    }
  }
  return cells;
}
let sphere = new SphereGeometry(5, 48, 48);
var cells = convertThreeToNormalsArray(sphere.faces, true);
var positions = convertThreeToNormalsArray(sphere.vertices);

export default class Root {
  constructor(props) {
    this.uniforms = {};
    this.canvas = document.createElement("canvas");
    this.canvas = document.body.appendChild(document.createElement('canvas'));
    this.stats = new Stats();
    document.body.appendChild(this.stats.domElement);
    this.camera = orbitCamera(this.canvas);
    this.canvas.style.backgroundColor = '#00c';
    this.geometryList = [];
    window.addEventListener('resize'
      , fit(this.canvas)
      , false
    )
    const image = new Image();
    image.src = 'moon.jpg';
    image.onload = (scope) => {
      this.init(image);
    }
  }

  init = (image) => {
    this.gl = require('gl-context')(this.canvas, this.render);
    this.geometryList.push(this.addGlow());
    this.geometryList.push(this.addMoon(image));
  }

  addGlow = () => {
    this.geometry = new Geometry(this.gl);
    const vertNormals = normals.vertexNormals(cells, positions);
    this.geometry.attr('aPosition', positions)
    this.geometry.attr('aNormal', vertNormals)
    this.geometry.faces(cells);
    this.shader = new glShader(this.gl, glowVert, glowFrag);
    this.geometry.bind(this.shader);
    return this.glowRender;
  }

  glowRender = ()=>{
    this.geometry.bind(this.shader);
    this.shader.uniforms.uProjection = projection;
    this.shader.uniforms.uView = view;
    this.shader.uniforms.uModel = model;
    this.shader.uniforms.time = performance.now();
    this.geometry.draw(this.gl.TRIANGLES);
  }

  addMoon = (image) => {
    const arr = [];
    const sq = 50.0;
    const zIndex = 0.0
    arr.push([-sq, -sq, zIndex]);
    arr.push([-sq, sq, zIndex]);
    arr.push([sq, sq, zIndex]);
    arr.push([sq, -sq, zIndex]);

    this.backGeometry = new Geometry(this.gl);
    this.backGeometry.attr('a_position', arr);
    this.texture = createTexture(this.gl, image);
    this.shaderBack = new glShader(this.gl, simpleVert, moonFrag);
    this.backGeometry.bind(this.shaderBack);
    this.uniform(this.shaderBack.program, '2f', 'vec2', 'u_resolution', this.canvas.width, this.canvas.height);
    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture.handle);
    this.uniform(this.shaderBack.program, '2f', 'vec2', 'u_tex0Resolution', image.width, image.height);
    return this.moonRender;
  }

  moonRender = ()=>{
    this.backGeometry.bind(this.shaderBack);
    this.shaderBack.uniforms.uProjection = projection;
    this.shaderBack.uniforms.uView = view;
    this.shaderBack.uniforms.uModel = model;
    this.shaderBack.uniforms.u_time = performance.now() * 0.001;
    this.backGeometry.draw(this.gl.TRIANGLE_FAN);
  }

  update = () => {
    this.camera.view(view);
    this.camera.tick();
    const aspectRatio = this.gl.drawingBufferWidth / this.gl.drawingBufferHeight;
    const fieldOfView = Math.PI / 4;
    const near = 0.01;
    const far = 100;

    mat4.perspective(projection
      , fieldOfView
      , aspectRatio
      , near
      , far
    )
  }

  render = () => {
    const width = this.gl.drawingBufferWidth;
    const height = this.gl.drawingBufferHeight;
    this.stats.begin();
    this.update();
    this.gl.viewport(0, 0, width, height);
    this.gl.enable(this.gl.DEPTH_TEST);

    this.geometryList.map((item) =>{
      item();
    })

    
    this.stats.end();
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
};

new Root();