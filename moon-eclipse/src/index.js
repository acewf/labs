import 'index.css'
import Stats from 'stats-js';
import GlslCanvas from 'glslCanvas';
import moon from './../publicDev/moon.frag';




export default class Root{
  constructor(props) {
    var canvas = document.createElement("canvas");
    this.canvas = canvas;
    this.stats = new Stats();
    document.body.appendChild(canvas);
    this.glsl = new GlslCanvas(canvas);
    this.initShader();
    console.log(Stats);
    console.log(this.stats);
    document.body.appendChild( this.stats.domElement );

    //window.onresize = onresize;
    //window.addEventListener("resize", onresize, false);
    requestAnimationFrame(this.animate);
  }

  onresize = ()=>{
    console.log('onResize');
    //this.glsl.setUniform('u_resolution', width, height);
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
    this.glsl.setUniform("u_time",1.0);
    this.glsl.setUniform('u_resolution', width, height);
    this.glsl.setUniform("u_tex0","moon.jpg");
    this.glsl.setUniform("u_tex1","stars-high.jpg");
    this.glsl.load(moon);
  }
}

new Root();