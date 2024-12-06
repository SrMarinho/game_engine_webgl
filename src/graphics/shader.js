class Shader {
    constructor(gl, vertexShaderSource, fragmentShaderSource) {
       this.gl = gl
       this.program = this.compileShader(vertexShaderSource, fragmentShaderSource)
    }

    createShader(type, source) {
        const shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);
        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            console.error(this.gl.getShaderInfoLog(shader));
            this.gl.deleteShader(shader);
            return null;
        }
        return shader;
    }

    compileShader(vertexShaderSource, fragmentShaderSource) {
        const vertexShader = this.createShader(this.gl.VERTEX_SHADER, vertexShaderSource)
        const fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, fragmentShaderSource)

        const program = this.gl.createProgram();
        this.gl.attachShader(program, vertexShader);
        this.gl.attachShader(program, fragmentShader);
        this.gl.linkProgram(program);
        if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
            console.error(gl.getProgramInfoLog(program));
            this.gl.deleteProgram(program);
        }

        return program
    }

    use() {
        this.gl.useProgram(this.program)
    }
}

export default Shader