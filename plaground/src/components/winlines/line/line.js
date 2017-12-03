import * as core from "pixi.js"

/**
 * The rope allows you to draw a texture across several points and them manipulate these points
 *
 *```js
 * for (let i = 0; i < 20; i++) {
 *     points.push(new PIXI.Point(i * 50, 0));
 * };
 * let rope = new PIXI.Rope(PIXI.Texture.fromImage("snake.png"), points);
 *  ```
 *
 * @class
 * @extends PIXI.mesh.Mesh
 * @memberof PIXI.mesh
 *
 */
export default class Line extends core.mesh.Mesh
{
    /**
     * @param {PIXI.Texture} texture - The texture to use on the rope.
     * @param {PIXI.Point[]} points - An array of {@link PIXI.Point} objects to construct this rope.
     */
    constructor(texture, points)
    {
        super(texture);

        /*
         * @member {PIXI.Point[]} An array of points that determine the rope
         */
        this.points = points;

        /*
         * @member {Float32Array} An array of vertices used to construct this Line.
         */
        this.vertices = new Float32Array(points.length * 4);

        /*
         * @member {Float32Array} The WebGL Uvs of the Line.
         */
         console.log(points);
        this.uvs = new Float32Array(points.length * 4);
        console.log(this.uvs);


        /*
         * @member {Float32Array} An array containing the color components
         */
        this.colors = new Float32Array(points.length * 2);

        /*
         * @member {Uint16Array} An array containing the indices of the vertices
         */
        this.indices = new Uint16Array(points.length * 2);

        /**
         * Tracker for if the rope is ready to be drawn. Needed because Mesh ctor can
         * call _onTextureUpdated which could call refresh too early.
         *
         * @member {boolean}
         * @private
         */
        this._ready = true;
        this._renderOnce = true;

        this.refresh();
    }

    /**
     * Refreshes
     *
     */
    refresh()
    {
        const points = this.points;

        // if too little points, or texture hasn't got UVs set yet just move on.
        if (points.length < 1 || !this._texture._uvs)
        {
            return;
        }

        // if the number of points has changed we will need to recreate the arraybuffers
        if (this.vertices.length / 4 !== points.length)
        {
            this.vertices = new Float32Array(points.length * 4);
            this.uvs = new Float32Array(points.length * 4);
            this.colors = new Float32Array(points.length * 2);
            this.indices = new Uint16Array(points.length * 2);
        }

        const uvs = this.uvs;

        const indices = this.indices;
        const colors = this.colors;

        const textureUvs = this._texture._uvs;
        const offset = new core.Point(textureUvs.x0, textureUvs.y0);
        const factor = new core.Point(textureUvs.x2 - textureUvs.x0, Number(textureUvs.y2 - textureUvs.y0));

        uvs[0] = 0 + offset.x;
        uvs[1] = 0 + offset.y;
        uvs[2] = 0 + offset.x;
        uvs[3] = factor.y + offset.y;

        colors[0] = 1;
        colors[1] = 1;

        indices[0] = 0;
        indices[1] = 1;

        const total = points.length;

        for (let i = 1; i < total; i++)
        {
            // time to do some smart drawing!
            let index = i * 4;
            const amount = i / (total - 1);

            uvs[index] = (amount * factor.x) + offset.x;
            uvs[index + 1] = 0 + offset.y;

            uvs[index + 2] = (amount * factor.x) + offset.x;
            uvs[index + 3] = factor.y + offset.y;

            index = i * 2;
            colors[index] = 1;
            colors[index + 1] = 1;

            index = i * 2;
            indices[index] = index;
            indices[index + 1] = index + 1;
        }

        // ensure that the changes are uploaded
        this.dirty++;
        this.indexDirty++;
    }

    /**
     * Clear texture UVs when new texture is set
     *
     * @private
     */
    _onTextureUpdate()
    {
        super._onTextureUpdate();

        // wait for the Rope ctor to finish before calling refresh
        if (this._ready)
        {
            this.refresh();
        }
    }

    /**
     * Updates the object transform for rendering
     *
     * @private
     */
    updateTransform()
    {
        const points = this.points;

        if (!this._renderOnce) {
            this.containerUpdateTransform();
            return;
        }

        if (points.length < 1)
        {
            return;
        }

        let lastPoint = points[0];
        let nextPoint;
        let perpX = 0;
        let perpY = 0;

        // this.count -= 0.2;

        const vertices = this.vertices;
        const total = points.length;

        let lastRadAngle = 0;
        let lastAngle = 0;
        let xMove;
        let num;
        let hTexture = this._texture.height / 2;

        for (let i = 0; i < total; i++)
        {
            const point = points[i];
            const index = i * 4;

            if (i < points.length - 1) {
                nextPoint = points[i + 1];
            }
            else {
                nextPoint = point;
            }
            num = hTexture;
            perpX = nextPoint.x - point.x;
            perpY = nextPoint.y - point.y;

            let angleInRad = Math.atan2(perpY, perpX);
            let angleDegrees = angleInRad*(180/Math.PI);
            xMove = Math.round(Math.tan(angleInRad) * num)/2;
            if (angleInRad == 0) {
                xMove = Math.round(Math.tan(lastRadAngle) * num)/2;
            } else if (this.inRange(angleDegrees,-1 * lastAngle,5)) {
                xMove = 0;
                num = Math.sqrt((hTexture * hTexture) + (hTexture * hTexture));
                num = Math.round(num);
            }

            vertices[index] = Math.round(point.x - xMove);
            vertices[index + 1] = point.y + num;
            vertices[index + 2] = Math.round(point.x + xMove);
            vertices[index + 3] = point.y - num;

            lastRadAngle = angleInRad;
            lastAngle = angleDegrees;

            lastPoint = point;
        }

        this.containerUpdateTransform();
        this._renderOnce = false;
    }

    inRange(angleDegrees,lastAngle,dif){
        return (angleDegrees-dif) < lastAngle && (angleDegrees+dif) > lastAngle;
    }

}
