import Vec3 from "./math/vec3.js";
import Mat4 from "./math/mat4.js";

class Camera {
    constructor(position, target, up, left, right, bottom, top, near, far) {
        this.position = position || new Vec3(10, 10, 10); // Posição da câmera
        this.target = target || new Vec3(0, 0, 0);   // Para onde a câmera está olhando
        this.up = up || new Vec3(0, 1, 0);            // Vetor "cima"

        // Parâmetros da projeção ortogonal
        this.left = left || -10;     // Limite esquerdo
        this.right = right || 10;    // Limite direito
        this.bottom = bottom || -10; // Limite inferior
        this.top = top || 10;        // Limite superior
        this.near = near || 0.1;    // Plano próximo
        this.far = far || 100;      // Plano distante

        this.viewMatrix = this.calculateViewMatrix();
        this.projectionMatrix = this.calculateOrthogonalProjectionMatrix();
    }

    update() {
        this.viewMatrix = this.calculateViewMatrix();
        this.projectionMatrix = this.calculateOrthogonalProjectionMatrix();
    }

    calculateViewMatrix() {
        // Calcula o vetor direção (Z)
        let forward = this.position.clone();
        forward.subtract(this.target);
        forward.normalize();

        // Calcula o vetor "direita" (X)
        let right = forward.clone();
        right = this.up.clone().cross(forward);
        right.normalize();

        // Calcula o vetor "cima" (Y)
        let up = right.clone();
        up = forward.clone().cross(right);
        up.normalize();

        // Calcula as translações
        const tx = -right.dot(this.position);
        const ty = -up.dot(this.position);
        const tz = forward.dot(this.position);

        // Retorna a matriz de visualização
        return new Mat4([
            [right.x, up.x, -forward.x, 0],
            [right.x, up.y, -forward.y, 0],
            [right.z, up.z, -forward.z, 0],
            [tx, ty, tz, 1]
        ]);
    }




    calculateOrthogonalProjectionMatrix() {
        const xscale = 2.0 / (this.right - this.left);
        const yscale = 2.0 / (this.top - this.bottom);
        const zscale = -2.0 / (this.far - this.near);
        const xoffset = -(this.right + this.left) / (this.right - this.left);
        const yoffset = -(this.top + this.bottom) / (this.top - this.bottom);
        const zoffset = -(this.far + this.near) / (this.far - this.near);

        return new Mat4([
            [xscale, 0.0,    0.0,    0.0],
            [0.0,    yscale, 0.0,    0.0],
            [0.0,    0.0,    zscale, 0.0],
            [xoffset, yoffset, zoffset, 1.0]
        ]);
    }
}

export default Camera;
