import {Container,Graphics} from "pixi.js"
import BucketView from "./bucket/view"
import ResourcesLoader from "./loader/resources-loader"
// import WinLinesView from "./winlines/view"

export default class DefaultView extends Container {
  constructor() {
        super();
        this.loaded = this.loaded.bind(this);
        const bucket = new BucketView();
        const loader = ResourcesLoader.load(this.loaded);
        this.addChild(bucket);

    }

    loaded(ev){
      // const winlineView = new WinLinesView(ev.resources);
      // this.addChild(winlineView);
    }
}
