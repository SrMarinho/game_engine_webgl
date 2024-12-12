import Vec3 from '../core/math/vec3.js';
import Mat4 from '../core/math/mat4.js';

class Transform {
    constructor(x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0, sx = 1, sy = 1, sz = 1) {
        this.position = new Vec3(x, y, z);
        this.rotation = new Vec3(rx, ry, rz);
        this.scale = new Vec3(sx, sy, sz);
    }

    getModelMatrix() {
        const mat4 = new Mat4();

        // Aplique a escala primeiro
        mat4.scale(new Vec3(this.scale.x, this.scale.y, this.scale.z));

        mat4.translate(this.position);

        mat4.rotate({
            x: this.rotation.x,
            y: this.rotation.y,
            z: this.rotation.z,
        });

        return mat4;
    }

    // Método para resetar as transformações (posição, rotação, escala)
    reset() {
        this.position = new Vec3(0, 0, 0);
        this.rotation = new Vec3(0, 0, 0);
        this.scale = new Vec3(1, 1, 1);
    }

    // Método para combinar (multiplicar) esta transformação com outra
    combine(transform) {
        const combinedMatrix = this.getModelMatrix();
        combinedMatrix.multiply(transform.getModelMatrix());
        return combinedMatrix;
    }

    // Métodos para configurar a posição, rotação e escala
    setPosition(x, y, z) {
        this.position = new Vec3(x, y, z);
    }

    setRotation(rx, ry, rz) {
        this.rotation = new Vec3(rx, ry, rz);
    }

    setScale(sx, sy, sz) {
        this.scale = new Vec3(sx, sy, sz);
    }

    // Métodos para obter a posição, rotação e escala
    getPosition() {
        return this.position;
    }

    getRotation() {
        return this.rotation;
    }

    getScale() {
        return this.scale;
    }

    // Método para converter a transformação em uma string legível para debugar
    toString() {
        return `Position: ${this.position.toString()}, Rotation: ${this.rotation.toString()}, Scale: ${this.scale.toString()}`;
    }
}

export default Transform;
