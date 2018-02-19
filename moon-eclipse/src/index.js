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

import { SphereGeometry } from 'three/src/geometries/SphereGeometry';
import glowFrag from './../publicDev/glow.frag';
import glowVert from './../publicDev/glow.vert';

const projection = mat4.create();
const model = mat4.create();
const view = mat4.create();

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
    this.canvas = document.createElement("canvas");
    this.canvas = document.body.appendChild(document.createElement('canvas'));
    this.stats = new Stats();
    document.body.appendChild( this.stats.domElement );
    this.camera = orbitCamera(this.canvas);
    this.gl = require('gl-context')(this.canvas, this.render);
    this.canvas.style.backgroundColor = '#000';
    this.geometry = Geometry(this.gl);
    window.addEventListener('resize'
      , fit(this.canvas)
      , false
    )
    this.init();
  }

  init = () => {
    const image = new Image();
    image.src = 'moon.jpg';
    
    const vertNormals = normals.vertexNormals(cells, positions);
    this.geometry.attr('aPosition', positions)
    this.geometry.attr('aNormal', vertNormals)
    this.geometry.faces(cells);
    this.texture = createTexture(this.gl, image);
    this.shader = glShader(this.gl, glowVert, glowFrag);
    this.shader.uniforms.texture = this.texture.bind();
    this.geometry.bind(this.shader);
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

    this.shader.uniforms.uProjection = projection
    this.shader.uniforms.uView = view;
    this.shader.uniforms.uModel = model;
    this.shader.uniforms.time = performance.now();
    this.geometry.draw(this.gl.TRIANGLES);
    this.stats.end();
  }
};

new Root();