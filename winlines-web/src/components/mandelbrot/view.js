/**
 * Created by pedro.martins on 08/08/2016.
 */
 import {Container,utils,Filter,mesh} from "pixi.js"
import _fragment from './../../shaders/mandelbrot.frag';
import _vertex from './../../shaders/mandelbrot.vert';
let shader;


export default class MandelBrotView extends Container {
    constructor(resources) {
        super();
        this._layout = resources.layout.data.winLines;
        this._settings = resources.settings.data.winLines;
        this.count = 0;
        this.update = this.update.bind(this);
        this.uniforms = {};
        this.uniforms.u_time = {type: '1f',value: 0};
        this.uniforms.u_resolution = { type: 'v2', value: { x: 200, y: 400}};
        this._create();
    }

    _create() {
        shader = new Filter(_vertex, _fragment,this.uniforms);
        this._mesh = new mesh.Mesh(utils.TextureCache['pattern']);
        this.addChild(this._mesh);
        console.log(this._mesh)
        this._mesh.filters = [shader];
        this._mesh.position.set(0,0);
        this._mesh.scale.set(4.0,4.0);
        this.update();
    }


    reset() {
    }

    update(){
        this.count +=10.0;
        shader.uniforms.u_time = this.count;
        this._frameRequest = window.requestAnimationFrame(this.update.bind(this));
    }
}
