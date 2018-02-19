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
    document.body.appendChild( this.stats.domElement );
    const options = {
      fragmentString:moon
    };
    this.glsl = new GlslCanvas(canvas,options);
    // this.glsl.gl.viewport(0, 0, canvas.width, canvas.height);
    
    //window.onresize = onresize;
    //window.addEventListener("resize", onresize, false);
    this.initShader();
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
    this.glsl.setUniform("u_tex0","moonmap.jpg");
    this.glsl.setUniform("u_tex1","background.jpg");
    // this.glsl.load(moon);
  }
}

new Root();