import {Container,Graphics,Filter} from "pixi.js"
import BucketView from "./bucket/view"
import * as SPINE from 'pixi-spine';
import ResourcesLoader from "./loader/resources-loader";
import WinLinesView from "./winlines/view";
import SpineView from "./spines/spines";

export default class DefaultView extends Container {
  constructor() {
        super();
        this.loaded = this.loaded.bind(this);
        const bucket = new BucketView();
        const loader = ResourcesLoader.load(this.loaded);
        this.bucket = bucket;
        this.resources = null;
        this.animation = null;
        this.addChild(bucket);

    }

    loaded(ev){
      const winlineView = new WinLinesView(ev.resources);
      this.addChild(winlineView);
      this.resources = ev.resources;
      const spineView = new SpineView(this.bucket);
      this.addChild(spineView);

      spineView.addSpine('powerup-json', this.resources['powerup-json'] , {x:0,y:0});
      spineView.addSpine('hero-json', this.resources['hero-json'] , {x:-420,y:0});
      spineView.addSpine('raptor-json', this.resources['raptor-json'] , {x:220,y:0});
      setTimeout(() => {
        // spineView.removeSpine('hero-json')
      }, 2500);
      this.loop(spineView);

      //setTimeout(() => this.changeSpine('spineboy-json'), 2500);
      //setTimeout(() => this.changeSpine('hero-json'), 7500);
      //setTimeout(() => this.changeSpine('raptor-json'), 15500);
      // setTimeout(() => this.changeSpine('goblins-json'), 8500);
    }

    loop(spineView){
        let anim = spineView.randomSpine();
        spineView.changeEffect(anim,spineView.blurFilter);
        setTimeout(() => {
          this.loop(spineView);
        }, 5500);
    }
}
