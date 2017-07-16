import {Container,Graphics,Filter} from "pixi.js"
import BucketView from "./bucket/view"
import * as SPINE from 'pixi-spine';
import ResourcesLoader from "./loader/resources-loader";
import MandelBrotView from "./mandelbrot/view";

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
      const mandelBrotView = new MandelBrotView(ev.resources);
      this.addChild(mandelBrotView);
      this.resources = ev.resources;
    }
}
