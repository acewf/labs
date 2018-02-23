import { Vector3 } from '../math/Vector3';


const mergeVertices = (vertices, faces) => {
    var verticesMap = {}; // Hashmap for looking up vertices by position coordinates (and making sure they are unique)
    var unique = [], changes = [];


    var v, key;
    var precisionPoints = 4; // number of decimal points, e.g. 4 for epsilon of 0.0001
    var precision = Math.pow(10, precisionPoints);
    var i, il, face;
    var indices, j, jl;

    for (i = 0, il = vertices.length; i < il; i++) {

        v = vertices[i];
        key = Math.round(v.x * precision) + '_' + Math.round(v.y * precision) + '_' + Math.round(v.z * precision);

        if (verticesMap[key] === undefined) {

            verticesMap[key] = i;
            unique.push([v.x, v.y, v.z]);
            changes[i] = unique.length - 1;
        } else {
            //    console.log('Duplicate vertex found. ', i, ' could be using ', verticesMap[key]);
            changes[i] = changes[verticesMap[key]];

        }

    }

    var faceIndicesToRemove = [];
    for (i = 0, il = faces.length; i < il; i++) {
        face = faces[i];
        const a = face[0];
        const b = face[1];
        const c = face[2];
        face[0] = changes[a];
        face[1] = changes[b];
        face[2] = changes[c];
        indices = [a, b, c];
        // if any duplicate vertices are found in a Face3
        // we have to remove the face as nothing can be saved
        for (var n = 0; n < 3; n++) {
            if (indices[n] === indices[(n + 1) % 3]) {
                faceIndicesToRemove.push(i);
                break;
            }
        }
    }

    var diff = vertices.length - unique.length;
    return {
        vertices:unique,
        faces
    }
}

export const Sphere = (radius, widthSegments, heightSegments) => {
    let positions = [];
    const vertices = [];
    const faces = [];
    const indices = [];
    const grid = [];
    const uvs = [];
    const normals = [];

    const phiStart = 0;
    const phiLength = Math.PI * 2;
    const thetaStart = 0;
    const thetaLength = Math.PI;
    const thetaEnd = thetaStart + thetaLength;

    let normal = new Vector3();
    let vertex = { x: 0, y: 0, z: 0 };
    let ix, iy, i, j;
    let index = 0;

    widthSegments = Math.max(3, Math.floor(widthSegments) || 8);
    heightSegments = Math.max(2, Math.floor(heightSegments) || 6);

    for (iy = 0; iy <= heightSegments; iy++) {
        var verticesRow = [];
        var v = iy / heightSegments;
        for (ix = 0; ix <= widthSegments; ix++) {
            var u = ix / widthSegments;
            // vertex
            vertex.x = - radius * Math.cos(phiStart + u * phiLength) * Math.sin(thetaStart + v * thetaLength);
            vertex.y = radius * Math.cos(thetaStart + v * thetaLength);
            vertex.z = radius * Math.sin(phiStart + u * phiLength) * Math.sin(thetaStart + v * thetaLength);
            vertices.push(vertex.x, vertex.y, vertex.z);
            // normal
            normal.set(vertex.x, vertex.y, vertex.z).normalize();
            normals.push(normal.x, normal.y, normal.z);
            // uv
            uvs.push(u, 1 - v);
            verticesRow.push(index++);
        }
        grid.push(verticesRow);
    }

    for (iy = 0; iy < heightSegments; iy++) {
        for (ix = 0; ix < widthSegments; ix++) {

            var a = grid[iy][ix + 1];
            var b = grid[iy][ix];
            var c = grid[iy + 1][ix];
            var d = grid[iy + 1][ix + 1];

            if (iy !== 0 || thetaStart > 0) indices.push(a, b, d);
            if (iy !== heightSegments - 1 || thetaEnd < Math.PI) indices.push(b, c, d);
        }
    }

    const vert = [];
    positions = vertices;
    for (i = 0, j = 0; i < positions.length; i += 3, j += 2) {
        vert.push(new Vector3(positions[i], positions[i + 1], positions[i + 2]));

    }
    
    for (i = 0; i < indices.length; i += 3) {
        faces.push([indices[i], indices[i + 1], indices[i + 2]]);
    }
    const vertix = mergeVertices(vert,faces);

    return {
        vertices: vertix.vertices,
        faces: vertix.faces
    }
}