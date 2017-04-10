import {Container,Graphics} from "pixi.js"

export default class BucketView extends Container {
  constructor() {
        super();
        const bucket = new Graphics();
        bucket.beginFill(0x000000, 0.5);
        bucket.drawRect(0, 0, 1024*window.devicePixelRatio, 768*window.devicePixelRatio);
        bucket.endFill();
        this.addChild(bucket);
    }
}
