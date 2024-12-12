function createPlane(width, height, horizontalDivisions, verticalDivisions) {
    const vertices = [];
    const indices = [];

    // Tamanho das divisões
    const stepX = width / horizontalDivisions;
    const stepY = height / verticalDivisions;

    // Criar os vértices com o centro no ponto (0, 0)
    for (let i = 0; i <= verticalDivisions; i++) {
        for (let j = 0; j <= horizontalDivisions; j++) {
            const x = -width / 2 + j * stepX; // Coordenada X (centrado)
            const y = -height / 2 + i * stepY; // Coordenada Y (centrado)
            const z = 0; // Coordenada Z (plano)
            vertices.push(x, y, z);
        }
    }

    // Criar os índices para os triângulos
    for (let i = 0; i < verticalDivisions; i++) {
        for (let j = 0; j < horizontalDivisions; j++) {
            const start = i * (horizontalDivisions + 1) + j;
            const next = start + horizontalDivisions + 1;

            // Primeiro triângulo
            indices.push(start, next, start + 1);

            // Segundo triângulo
            indices.push(start + 1, next, next + 1);
        }
    }

    return { vertices, indices };
}

const { vertices, indices } = createPlane(10, 10, 100, 100)

export { vertices, indices};
