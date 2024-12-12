class Mesh {
    constructor(gl, vertices, indices, colors, attributes, uniforms, wireframe = false) {
        this.gl = gl;
        this.vertices = vertices;
        this.indices = indices;
        this.colors = colors;
        this.attributes = attributes;
        this.uniforms = uniforms;
        this.wireframe = wireframe;
        
        this.vertexBuffer = null;
        this.indexBuffer = null;
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

        // Configurar atributos de vértices
        for (const [name, config] of Object.entries(this.attributes)) {
            const { size, type, normalized, stride, offset } = config;

            // Obter localização do atributo no programa
            const location = gl.getAttribLocation(program, name);

            if (location !== -1) {
                gl.vertexAttribPointer(location, size, type, normalized, stride, offset);
                gl.enableVertexAttribArray(location);
            } else {
                console.warn(`Atributo "${name}" não encontrado no shader.`);
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
        const colorLocation = gl.getAttribLocation(program, "aColor");
        if (colorLocation !== -1) {
            gl.disableVertexAttribArray(colorLocation);
        }

        // Desvincular buffers
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    }
}

export default Mesh;
