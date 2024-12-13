class Mesh {
    constructor(gl, vertices, indices, normals, colors, attributes, uniforms, wireframe = false) {
        this.gl = gl;
        this.vertices = vertices;
        this.indices = indices;
        this.normals = normals 
        // if (this.normals == null | this.normals.length == 0) {
        //     this.normals = this.calculateNormals(this.vertices, this.indices);
        //     console.log(this.normals);
            
        // }
        this.colors = colors;
        this.attributes = attributes;
        this.uniforms = uniforms;
        this.wireframe = wireframe;
        
        this.vertexBuffer = null;
        this.indexBuffer = null;
        this.normalBuffer = null
        this.colorBuffer = null;

        this.initBuffers();
    }

    initBuffers() {
        const gl = this.gl;

        // Criar buffer de vértices
        this.vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);

        // Criar buffer de índices
        this.indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);

        if (this.attributes.aNormal) {
            this.normalBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normals), gl.STATIC_DRAW);
        }

        if (this.colors.length > 0){
            // Criar buffer de cores
            this.colorBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.colors), gl.STATIC_DRAW);
        }
    }

    bind(program) {
        const gl = this.gl;

        // Vincular buffer de vértices
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        const positionLocation = gl.getAttribLocation(program, "aPosition");
        if (positionLocation !== -1) {
            gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(positionLocation);
        } else {
            console.warn(`Atributo "aPosition" não encontrado no shader.`);
        }

        if (this.attributes.aNormal) {
            gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
            const normalLocation = gl.getAttribLocation(program, "aNormal");
            if (normalLocation !== -1) {
                gl.vertexAttribPointer(normalLocation, 3, gl.FLOAT, false, 0, 0);
                gl.enableVertexAttribArray(normalLocation);
            } else {
                console.warn(`Atributo "aNormal" não encontrado no shader.`);
            }
        }

        if (this.colors.length > 0){
            // Vincular buffer de cores e configurar atributo
            gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
            const colorLocation = gl.getAttribLocation(program, "aColor");
            if (colorLocation !== -1) {
                gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0);
                gl.enableVertexAttribArray(colorLocation);
            } else {
                console.warn(`Atributo "aColor" não encontrado no shader.`);
            }
        }

        // Vincular buffer de índices
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    }

    draw() {
        const gl = this.gl;

        if (this.wireframe) {
            gl.drawElements(gl.LINES, this.indices.length, gl.UNSIGNED_SHORT, 0);
        } else {
            gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_SHORT, 0);
        }
        // gl.drawElements(gl.TRIANGLE_STRIP, this.indices.length, gl.UNSIGNED_SHORT, 0);
        // gl.drawElements(gl.LINE_LOOP, this.indices.length, gl.UNSIGNED_SHORT, 0);
    }

    unbind(program) {
        const gl = this.gl;

        // Desabilitar atributos
        for (const name of Object.keys(this.attributes)) {
            const location = gl.getAttribLocation(program, name);
            if (location !== -1) {
                gl.disableVertexAttribArray(location);
            }
        }

        // Desabilitar o atributo de cor
        const normalsLocation = gl.getAttribLocation(program, "aNormal");
        if (normalsLocation !== -1) {
            gl.disableVertexAttribArray(normalsLocation);
        }

        // Desabilitar o atributo de cor
        const colorLocation = gl.getAttribLocation(program, "aColor");
        if (colorLocation !== -1) {
            gl.disableVertexAttribArray(colorLocation);
        }

        // Desvincular buffers
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    }

    calculateNormals(vertices, indices) {
    // Array para armazenar as normais
        const normals = new Array(vertices.length).fill(0.0);

        // Itera pelos triângulos
        for (let i = 0; i < indices.length; i += 3) {
            const i0 = indices[i] * 3;
            const i1 = indices[i + 1] * 3;
            const i2 = indices[i + 2] * 3;

            // Obtém os vértices do triângulo
            const v0 = [vertices[i0], vertices[i0 + 1], vertices[i0 + 2]];
            const v1 = [vertices[i1], vertices[i1 + 1], vertices[i1 + 2]];
            const v2 = [vertices[i2], vertices[i2 + 1], vertices[i2 + 2]];

            // Calcula os vetores da aresta
            const edge1 = [v1[0] - v0[0], v1[1] - v0[1], v1[2] - v0[2]];
            const edge2 = [v2[0] - v0[0], v2[1] - v0[1], v2[2] - v0[2]];

            // Calcula o produto vetorial para obter a normal
            const normal = [
                edge1[1] * edge2[2] - edge1[2] * edge2[1],
                edge1[2] * edge2[0] - edge1[0] * edge2[2],
                edge1[0] * edge2[1] - edge1[1] * edge2[0],
            ];

            // Normaliza o vetor normal
            const length = Math.sqrt(normal[0] ** 2 + normal[1] ** 2 + normal[2] ** 2);
            if (length > 0.0) {
                normal[0] /= length;
                normal[1] /= length;
                normal[2] /= length;
            }

            // Adiciona a normal aos vértices do triângulo
            for (const index of [i0, i1, i2]) {
                normals[index] += normal[0];
                normals[index + 1] += normal[1];
                normals[index + 2] += normal[2];
            }
        }

        // Normaliza todas as normais do array
        for (let i = 0; i < normals.length; i += 3) {
            const nx = normals[i];
            const ny = normals[i + 1];
            const nz = normals[i + 2];
            const length = Math.sqrt(nx ** 2 + ny ** 2 + nz ** 2);
            if (length > 0.0) {
                normals[i] /= length;
                normals[i + 1] /= length;
                normals[i + 2] /= length;
            }
        }

        return normals;
    }
}

export default Mesh;
