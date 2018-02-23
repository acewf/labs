import 'index.css'
import Stats from 'stats-js';
import fit from 'canvas-fit';
import mat4 from 'gl-mat4';
import lookatCamera from 'lookat-camera';

import Moon from './Moon';
import Glow from './Glow';

const projection = new mat4.create();
const model = new mat4.create();
const view = new mat4.create();

const fieldOfView = Math.PI / 4;
const near = 0.01;
const far = 200;


export default class App {
  constructor(props) {
    this.uniforms = {};
    this.canvas = document.createElement("canvas");
    this.canvas = document.body.appendChild(document.createElement('canvas'));
    this.stats = new Stats();
    document.body.appendChild(this.stats.domElement);
    this.camera = lookatCamera(this.canvas);
    this.camera.position = new Float32Array([0, 0, 40]);
    this.camera.target = new Float32Array([0, 0, 0]);
    this.canvas.style.backgroundColor = '#000';
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
    this.geometryList.push(new Glow(this.gl, { projection, model, view }).render);
    this.geometryList.push(new Moon(this.gl, { projection, model, view }, image).render);
  }

  update = () => {
    this.camera.view(view);
    const aspectRatio = this.gl.drawingBufferWidth / this.gl.drawingBufferHeight;
    mat4.perspective(projection, fieldOfView, aspectRatio, near, far);
  }

  render = () => {
    const width = this.gl.drawingBufferWidth;
    const height = this.gl.drawingBufferHeight;
    this.stats.begin();
    this.update();
    this.gl.viewport(0, 0, width, height);
    //this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.enable(this.gl.CULL_FACE);
    const now = performance.now()*1.0;
    this.geometryList.map((item) => {
      item(now);
    })
    this.stats.end();
  }
};

new App();