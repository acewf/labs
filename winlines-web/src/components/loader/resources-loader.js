import {loaders} from "pixi.js"

export default class ResourcesLoader {
  static load(callback){

    const loader = new loaders.Loader();
    loader.add('settings', 'res/settings.json');
    loader.add('layout', 'res/layout.json');
    loader.add('spritesheet-json', 'res/scale-'+window.devicePixelRatio+'/sheets/high-res-sheet-0.json');
    loader.add('spritesheet-png', 'res/scale-'+window.devicePixelRatio+'/sheets/high-res-sheet-0.png');
    //loader.add('smoulder-json', 'res/smoulder/smoulder-idle_basic.json');
    //loader.add('mpd-json', 'res/mpd/bar-symbol-red.json');
    loader.add('hero-json', 'res/hero/hero-mesh.json');
    //loader.add('goblins-json', 'res/goblins/goblins-mesh.json');
    //loader.add('smoulder-json', 'res/smoulder/smoulder-idle.json');
    //loader.add('spineboy-json', 'res/spineboy/spineboy.json');
    //loader.add('raptor-json', 'res/raptor/raptor.json');
    
    //loader.add('powerup-json', 'res/powerup/powerup.json');

    loader.load((e)=>{
      callback.call(this,e);
    })
  }
}
