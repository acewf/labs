/**
 * Created by pedro.martins on 08/08/2016.
 */
import {Container,Graphics,Point} from "pixi.js"
import Line from "./../line/line";

export default class LineGraphicUtils {
    static drawLine(linePoints, texture, width) {
        let vertices = [];
        let total = linePoints.length;
        let Display = {scale:window.devicePixelRatio};

        vertices.push(new Point((linePoints[0].x - width) * Display.scale, linePoints[0].y * Display.scale));
        for (let i = 0; i < total; i++) {
            vertices.push(new Point(linePoints[i].x * Display.scale, linePoints[i].y * Display.scale));
        }
        vertices.push(new Point((linePoints[linePoints.length - 1].x + width) * Display.scale, linePoints[linePoints.length - 1].y * Display.scale));
        return new Line(texture, vertices);
    }
}
