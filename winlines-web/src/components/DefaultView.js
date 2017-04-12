import {Container,Graphics} from "pixi.js"
import BucketView from "./bucket/view"
import * as SPINE from 'pixi-spine';
import ResourcesLoader from "./loader/resources-loader"
// import WinLinesView from "./winlines/view"

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
      // const winlineView = new WinLinesView(ev.resources);
      // this.addChild(winlineView);
      this.resources = ev.resources;
      // raptor-json
      // raptor-json
      this.changeSpine('powerup-json');
      //setTimeout(() => this.changeSpine('spineboy-json'), 2500);
      //setTimeout(() => this.changeSpine('raptor-json'), 9500);
      setTimeout(() => this.changeSpine('goblins-json'), 2500);
    }

    changeSpine(spineID){
      let data = this.resources[spineID];
      if(this.animation){
        this.removeChild(this.animation);
      }
      this.animation = new PIXI.spine.Spine(data.spineData);
      let animation = this.animation;
      let element = animation.stateData.skeletonData;
      const x = (this.bucket.width/2);
      const y = (this.bucket.height/2)+element.height/2;
      animation.position.set(x,y);
      this.addChild(animation);
      const animations = animation.state.data.skeletonData.animations;
      let animIndex = 0;
      animation.state.setAnimation(0, animations[0].name, false);
      animation.state.addListener({ complete: function(track, event) {
        animation.state.setAnimation(0, animations[animIndex].name, false);
        animIndex++;
        if(animIndex>=animations.length){
          animIndex = 0;
        }
      }});
    }
}
