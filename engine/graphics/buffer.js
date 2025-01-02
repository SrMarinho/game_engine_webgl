class Buffer {
    constructor(gl, target, srcData, usage = gl.STATIC_DRAW) {
        this.gl = gl;
        this.target = target;
        this.srcData = srcData;
        this.usage = usage;
        this.buffer = this.gl.createBuffer();
        this.init();
    }

    // Inicializa o buffer com os dados fornecidos
    init() {
        this.bind();
        this.gl.bufferData(this.target, this.srcData, this.usage);
        this.unbind();
    }

    // Vincula o buffer ao target
    bind() {
        this.gl.bindBuffer(this.target, this.buffer);
    }

    // Desvincula o buffer do target
    unbind() {
        this.gl.bindBuffer(this.target, null);
    }

    // Atualiza os dados do buffer
    updateData(newData, offset = 0) {
        this.bind();
        this.gl.bufferSubData(this.target, offset, newData);
        this.unbind();
    }

    // Exclui o buffer
    delete() {
        this.gl.deleteBuffer(this.buffer);
        this.buffer = null;
    }
}
