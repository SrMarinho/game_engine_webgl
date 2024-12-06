import Renderable from '../renderable.js'
import { vertices, indices, colors } from './cube-mesh.js'
import Mesh from '../../graphics/mesh.js'
import Transform from '../transform.js'

class Cube extends Renderable {
    constructor(gl) {
        super(gl)

        this.shadersPath = {
            vertexShader: 'assets/shaders/cube/vertex.glsl',
            fragmentShader: 'assets/shaders/cube/fragment.glsl'
        }

        this.attributes = {
            aPosition: { size: 3, type: gl.FLOAT, normalized: false, stride: 0, offset: 0 },
            aColor: { size: 3, type: gl.FLOAT, normalized: false, stride: 0, offset: 0 }
        }

        this.tranform = new Transform()

        this.mesh = new Mesh(this.gl, vertices, indices, colors, this.attributes, this.uniforms)
    }

    setUniforms() {
        const uTimeLocation = this.gl.getUniformLocation(this.shader.program, 'uTime');
        const uTime = performance.now()/ 1000
        if (uTimeLocation !== -1) {
            this.gl.uniform1f(uTimeLocation, uTime);
        } else {
            console.warn(`Uniforme uTime não encontrado no shader.`);
        }
        

        const uModelMatrixLocation = this.gl.getUniformLocation(this.shader.program, 'uModelMatrix');
        const uModelMatrix = this.tranform.getModelMatrix().clone()
        if (uModelMatrixLocation !== -1) {
            this.gl.uniformMatrix4fv(uModelMatrixLocation, false, uModelMatrix.get().flat());
        } else {
            console.warn(`Uniforme uModelMatrix não encontrado no shader.`);
        }

        const uViewMatrixLocation = this.gl.getUniformLocation(this.shader.program, 'uViewMatrix');
        const uViewMatrix = this.viewMatrix
        if (uViewMatrixLocation !== -1) {
            this.gl.uniformMatrix4fv(uViewMatrixLocation, false, uViewMatrix.get().flat());
        } else {
            console.warn(`Uniforme uModelMatrix não encontrado no shader.`);
        }

        // console.log(this.projectionMatrix);
        if (this.projectionMatrix) {
            const uProjectionMatrixLocation = this.gl.getUniformLocation(this.shader.program, 'uProjectionMatrix');
            const uProjectionMatrix = this.projectionMatrix.get()
            
            if (uProjectionMatrixLocation !== -1) {
                this.gl.uniformMatrix4fv(uProjectionMatrixLocation, false, uProjectionMatrix.flat());
            } else {
                console.warn(`Uniforme uProjectionMatrix não encontrado no shader.`);
            }
        }
    }
}

export default Cube