import 'index.css'
import Stats from 'stats-js';
import Geometry from 'gl-geometry';
import fit from 'canvas-fit';
//import glShader from 'gl-shader';
import mat4 from 'gl-mat4';
import normals from 'normals';
import {SphereGeometry} from 'three/src/geometries/SphereGeometry';
// import glslify from 'glslify';
// import Sphere from './sphere';

// var datasphere = require('./sphere');
// import moon from './../publicDev/moon.frag';

// console.log('three-->',SphereGeometry);
var sphere = new SphereGeometry(5, 12, 12 );
export default class Root{
  constructor(props) {
    var canvas = document.createElement("canvas");
    this.canvas = canvas;
    this.stats = new Stats();
    document.body.appendChild(canvas);
    document.body.appendChild( this.stats.domElement );
    const options = {
      // fragmentString:moon
    };
    //console.log(sphere);
    this.initShader();
    requestAnimationFrame(this.animate);
  }

  onresize = ()=>{
    console.log('onResize');
  }

  animate = ()=>{
    this.stats.begin();

    // monitored code goes here

    this.stats.end();
    requestAnimationFrame( this.animate );

  }

  initShader(){
    const width =  this.canvas.width*window.devicePixelRatio;
    const height =  this.canvas.width*window.devicePixelRatio;
  }
}

new Root();