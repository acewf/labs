export const Circle = (radius, segments) => {
    const positions = [];
    const vertices = [];
    const faces = [];
    const indices = [];
    positions.push(0, 0, 0);
    const thetaStart = 0;
    const thetaLength = Math.PI * 2;
    let vertex = { x: 0, y: 0, z: 0 };
    let i, s, j;

    segments = segments !== undefined ? Math.max(3, segments) : 8;

    for (s = 0, i = 3; s <= segments; s++ , i += 3) {
        const segment = thetaStart + s / segments * thetaLength;
        vertex.x = radius * Math.cos(segment);
        vertex.y = radius * Math.sin(segment);
        positions.push(vertex.x, vertex.y, vertex.z);
    }

    for (i = 1; i <= segments; i++) {
        indices.push(i, i + 1, 0);
    }

    for (i = 0, j = 0; i < positions.length; i += 3, j += 2) {
        vertices.push([positions[i], positions[i + 1], positions[i + 2]]);
    }
    // const index = setIndex(indices);

    for (i = 0; i < indices.length; i += 3) {
        faces.push([indices[i], indices[i + 1], indices[i + 2]]);
    }

    return {vertices,faces};
}