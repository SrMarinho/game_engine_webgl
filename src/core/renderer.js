class Renderer {
    constructor(gl) {
        this.gl = gl
        // this.gl.enable(this.gl.CULL_FACE);             // Ativa o culling
        // this.gl.enable(this.gl.DEPTH_TEST);
        // this.gl.cullFace(this.gl.BACK);                // Descarta as faces traseiras
        // this.gl.frontFace(this.gl.CCW);                // Define sentido anti-horário como frente
    }

    render(obj) {
        obj.shader.use()
        obj.mesh.bind(obj.shader.program)
        obj.setUniforms()
        obj.mesh.draw()
        obj.mesh.unbind(obj.shader.program)
    }
}

export default Renderer