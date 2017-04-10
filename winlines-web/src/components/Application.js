import {Container,Graphics} from "pixi.js"

export default class Application{
  constructor(view){
    this._canvas = document.getElementById('game');
    this._renderer = null;
    this._stage = view;
    this._ticker = PIXI.ticker.shared;
    this._display = {
      width:300 ,
      height:300,
      rendererOptions:{
        view:null,
        resolution:1,
        antialias:false,
        transparent:true,
        backgroundColor : 0xcccccc
      }
    }
    this._update = this._update.bind(this);
    this.setupStage();
  }

  setupStage() {
    this._display.rendererOptions.view = this._canvas;
    this._renderer = PIXI.autoDetectRenderer(this._display.width, this._display.height, this._display.rendererOptions);
    this._update();
    window.onresize = this._resizeStage.bind(this);
  }

  _resizeStage() {
    this._display.width = window.innerWidth *window.devicePixelRatio;
    this._display.height = window.innerHeight *window.devicePixelRatio;
    this._renderer.resize(this._display.width, this._display.height);
    this._canvas.style.width = String(window.innerWidth) + 'px';
    this._canvas.style.height = String(window.innerHeight) + 'px';
    this._canvas.style.x = '0px';
    this._canvas.style.y = '0px';
    this.setCanvasStyle();
    this._centreStage();
  }

  _centreStage() {
    this._stage.x = this._display.width*.5-1024*window.devicePixelRatio/2;
    this._stage.y = this._display.height*.5-768*window.devicePixelRatio/2;
  }

  _update(time) {
    if (!this._pause) {
      this._frameRequest = window.requestAnimationFrame(this._update.bind(this));
      if(this._stage){
        this._renderer.render(this._stage);
      }
    }
  }

  set stage(element){
    this._stage = element;
  }

  setCanvasStyle() {
    this._canvas.width = this._display.width;
    this._canvas.height = this._display.height;
  }
}
