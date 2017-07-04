import {Container,Graphics,Filter} from "pixi.js"
import ResourcesLoader from "./../loader/resources-loader";
import * as SPINE from 'pixi-spine';
import _fragment from './../../shaders/smoke.frag';

export default class SpineView extends Container {

    constructor(bucket) {
        super();
        this.bucket = bucket;
        this._listOfSpines  = [];
        this._indexOfSpines = {};
    }

    addSpine(id, data, position){
        const animation = new PIXI.spine.Spine(data.spineData);
        let element = animation.stateData.skeletonData;
        let x = (this.bucket.width/2);
        let y = (this.bucket.height/2)+element.height/2;
        x += position.x;
        y += position.y;
        animation.position.set(x,y);
        
        this.addChild(animation);
        const animations = animation.state.data.skeletonData.animations;
        animation.animIndex = 0;
        animation.state.setAnimation(0, animations[0].name, false);
        animation.state.addListener({ complete: (track, event)=> {this.changeSpineTrack(track, event,animation)} });
        this._indexOfSpines[id] = this._listOfSpines.length;
        this._listOfSpines.push(animation);
    }

    get smokeFilter(){
        const uniforms = {};
        uniforms.u_time = {type: '1f',value: 0};
        uniforms.u_resolution = { type: 'v2', value: { x: 800, y: 400}};
        return new Filter('', _fragment,uniforms);
    }

    get blurFilter(){
        return new PIXI.filters.BlurFilter();
    }

    getElemById(id){
        try {
            return this._listOfSpines[this._indexOfSpines[id]];;
        } catch (error) {
            return;   
        }
    }

    removeSpine(id){
        let animation = this.getElemById(id);
        if(animation){
            this._listOfSpines.splice(this._indexOfSpines[id],1);
            if(animation.filters && animation.filters.length){
                animation.filters = [];
            }
            this.removeChild(animation);
            this._indexOfSpines[id] =  null;
        }
    }

    randomSpine(){
        const index = Math.round(Math.random()*(this._listOfSpines.length-1));
        return this._listOfSpines[index];
    }

    changeEffect(anim, filter){
        anim.filters = [filter];
         setTimeout(() => {
          anim.filters =[];
        }, 2500);
    }

    changeSpineTrack(track, event,animation){
        const animations = animation.state.data.skeletonData.animations;
        animation.state.setAnimation(0, animations[animation.animIndex].name, false);
        animation.animIndex++;
        if(animation.animIndex>=animations.length){
            animation.animIndex = 0;
        }
    }
}
