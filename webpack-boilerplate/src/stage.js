export default class Stage{
  constructor(){
    this._canvas = document.getElementById('game');
    this._renderer = null;
    this._ticker = PIXI.ticker.shared;
    this._display = {
      width:window.innerWidth,
      height:window.innerHeight,
      rendererOptions:{
        view:null,
        resolution:1,
        backgroundColor:0x000000
      }
    }
  }


  setupStage() {
    this._display.rendererOptions.view = this._canvas;
    this.setCanvasStyle();
    this._renderer = PIXI.autoDetectRenderer(this._display.width, this._display.height, this._display.rendererOptions);
    //this._renderer.plugins.interaction.setTargetElement(this._canvas);
    this._update();
    window.onresize = this._resizeStage.bind(this);
  }

  _resizeStage() {
    this._renderer.resize(width, height);
    this._canvas.style.width = String(window.innerWidth) + 'px';
    this._canvas.style.height = String(window.innerHeight) + 'px';
    this._canvas.style.x = '0px';
    this._canvas.style.y = '0px';
    this._centreStage();
  }

  _centreStage() {
      //this._stage.x = Display.screenCentreX - Display.bucketCentreX;
      //this._stage.y = Display.screenCentreY - Display.bucketCentreY;
  }

  _update(time) {
      if (!this._pause) {
          this._frameRequest = window.requestAnimationFrame(this._update.bind(this));
          TWEEN.update();
          this._ticker.update(time);
          this._renderer.render(this._stage);
      }
  }

  setCanvasStyle() {
      this._canvas.style.width = String(this._display.width) + 'px';
      this._canvas.style.height = String(this._display.height) + 'px';
  }
}
