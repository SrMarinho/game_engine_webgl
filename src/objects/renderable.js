import { Loader } from '../utils/loader.js'
import Shader from '../graphics/shader.js'

class Renderable {
    constructor(gl) {
        this.gl = gl
        this.viewMatrix = null
        this.projectionMatrix = null
    }

    async init() {
        this.vertexShaderSource = await Loader.loadShader(this.shadersPath["vertexShader"])
        this.fragmentShaderSource = await Loader.loadShader(this.shadersPath["fragmentShader"])

        this.shader = new Shader(this.gl, this.vertexShaderSource, this.fragmentShaderSource)
    }

    setViewMatrix(viewMatrix) {
        this.viewMatrix = viewMatrix
    }

    
    setProjectionMatrix(projectionMatrix) {
        this.projectionMatrix = projectionMatrix
    }
}


export default Renderable