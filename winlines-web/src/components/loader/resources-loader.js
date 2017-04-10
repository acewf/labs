import {loaders} from "pixi.js"

export default class ResourcesLoader {
  static load(callback){

    const loader = new loaders.Loader();
    loader.add('settings', 'res/settings.json');
    loader.add('layout', 'res/layout.json');
    loader.add('spritesheet-json', 'res/scale-'+window.devicePixelRatio+'/sheets/high-res-sheet-0.json');
    loader.add('spritesheet-png', 'res/scale-'+window.devicePixelRatio+'/sheets/high-res-sheet-0.png');
    loader.load((e)=>{
      callback.call(this,e);
    })
  }
}
