/**
 * Created by pedro.martins on 08/08/2016.
 */
 import {Container,utils,Filter} from "pixi.js"
import LineMesh from "./graphic/line-graphic-utils";
import LinePositionUtils from  "./position/line-position-utils";
import _fragment from './../../shaders/flames.frag';
let shader;


export default class WinLinesView extends Container {
    constructor(resources) {
        super();
        this._layout = resources.layout.data.winLines;
        this._settings = resources.settings.data.winLines;
        this._createLines();
        this.count = 0;
        this.update = this.update.bind(this);
        this.uniforms = {};
        this.uniforms.u_time = {type: '1f',value: 0};
        this.uniforms.u_resolution = { type: 'v2', value: { x: 800, y: 400}};
    }

    _createLines() {
        let lines = LinePositionUtils.getLinePositions(this._settings.winLinesMatrix, this._layout);
        let numberOfWinLines = lines.length-1;
        this._lineSprites = [];
        for (let i = 0; i < 1; i++) {
            let lineData = lines[i+4];
            let line = LineMesh.drawLine(lineData, utils.TextureCache['win-line'], this._layout.width);
            this._lineSprites.push(line);
        }
        shader = new Filter('', _fragment,this.uniforms);
        this.update();
        this.showLines([0]);
    }

    showLines(linesToShow) {
        this._removeLines();
        let numbOfLines = linesToShow.length;
        for (let i = 0; i < numbOfLines; i++) {
            this._addLine(this._lineSprites[linesToShow[i]]);
        }
    }

    _removeLines() {
        this.removeChildren();
    }

    _addLine(lineToShow) {
        lineToShow.filters = [shader];
        this.addChild(lineToShow);
    }

    reset() {
        this._removeLines();
    }

    showLine(lineIndex) {
        this._removeLines();
        this._addLine(this._lineSprites[lineIndex]);
    }

    update(){
        this.count +=0.02;
        shader.uniforms.u_time = this.count;
        this._frameRequest = window.requestAnimationFrame(this.update.bind(this));
    }
}
