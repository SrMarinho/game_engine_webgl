import Vec3 from "./math/vec3.js";
import Mat4 from "./math/mat4.js";

class Camera {
    constructor(position, target, up, left, right, bottom, top, near, far) {
        this.left = left || -10;     // Limite esquerdo
        this.right = right || 10;    // Limite direito
        this.bottom = bottom || -10; // Limite inferior
        this.top = top || 10;        // Limite superior
        this.near = near || 0.1;    // Plano próximo
        this.far = far || 1000;      // Plano distante
        this.position = position || new Vec3(3, 3, -3); // Posição da câmera
        this.target = target || new Vec3(0, 1, 0);   // Para onde a câmera está olhando
        this.up = up || new Vec3(0, 1, 0);            // Vetor "cima"

        this.fov = 90
        this.aspect = 1.0

        this.transition = 1

        this.viewMatrix = this.calculateViewMatrix();
        this.projectionMatrix = this.calculateHybridProjectionMatrix();
    }

    update() {
        this.adjustOrthogonalBounds();
        this.viewMatrix = this.calculateViewMatrix();
        this.projectionMatrix = this.calculateHybridProjectionMatrix();
    }


    calculateViewMatrix() {
        // Calcula o vetor direção (Z)
        let forward = this.target.clone().subtract(this.position).normalize();
        
        // Calcula o vetor "direita" (X)
        let right = forward.clone().cross(this.up).normalize();

        let up = right.clone().cross(forward);

        // Calcula as translações
        const tx = -right.dot(this.position);
        const ty = -up.dot(this.position);
        const tz = forward.dot(this.position);

        return new Mat4([
            [right.x, up.x, -forward.x, 0],
            [right.y, up.y, -forward.y, 0],
            [right.z, up.z, -forward.z, 0],
            [tx, ty, tz, 1]
        ])
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

    calculatePerspectiveProjectionMatrix() {
        const f = 1.0 / Math.tan((this.fov * Math.PI) / 360); // Cotangente do meio do campo de visão
        const rangeInv = 1.0 / (this.near - this.far);

        return new Mat4([
            [f / this.aspect, 0.0,  0.0,                         0.0],
            [0.0,        f,    0.0,                         0.0],
            [0.0,        0.0, (this.near + this.far) * rangeInv,   -1.0],
            [0.0,        0.0,  2 * this.near * this.far * rangeInv, 0.0]
        ]);
    }

    calculateHybridProjectionMatrix() {
        // Matriz ortogonal
        const orthoMatrix = this.calculateOrthogonalProjectionMatrix().get();

        // Matriz perspectiva
        const perspectiveMatrix = this.calculatePerspectiveProjectionMatrix().get();

        // Interpolação entre as matrizes
        const hybridMatrix = orthoMatrix.map((row, rowIndex) =>
            row.map((orthoValue, colIndex) =>
                (1 - this.transition) * orthoValue + this.transition * perspectiveMatrix[rowIndex][colIndex]
            )
        );

        return new Mat4(hybridMatrix);
    }

    move(deltaTime, moveForward = 0, moveRight = 0, moveUp = 0) {
        // Calcula os vetores direção, direita e cima
        const forward = this.target.clone().subtract(this.position).normalize();
        const right = forward.clone().cross(this.up).normalize();
        const up = right.clone().cross(forward).normalize();

        // Calcula o deslocamento total
        const movement = forward.multiply(moveForward)
            .add(right.multiply(moveRight))
            .add(up.multiply(moveUp))
            .multiply(deltaTime);

        // Atualiza a posição e o alvo
        this.position.add(movement);
        this.target.add(movement);

        // Atualiza a matriz de visão
        this.update();
    }


    rotate(yaw = 0, pitch = 0, roll = 0) {
        this.yaw(yaw)
        this.pitch(pitch)
        this.roll(roll)
    }

    pitch(angle) {
        // Calcula a direção da câmera (do target para a posição)
        let direction = this.target.clone().subtract(this.position).normalize();

        // Calcula o vetor 'right' (direção direita da câmera)
        let right = direction.clone().cross(this.up).normalize();

        // Aplica a rotação no eixo X (pitch) localmente
        const cosPitch = Math.cos(angle);
        const sinPitch = Math.sin(angle);
        
        // Aplica a rotação no eixo perpendicular ao 'right' (pitch)
        direction = new Vec3(
            direction.x * (cosPitch + (1 - cosPitch) * right.x * right.x) +
                direction.y * ((1 - cosPitch) * right.x * right.y - sinPitch * right.z) +
                direction.z * ((1 - cosPitch) * right.x * right.z + sinPitch * right.y),

            direction.x * ((1 - cosPitch) * right.y * right.x + sinPitch * right.z) +
                direction.y * (cosPitch + (1 - cosPitch) * right.y * right.y) +
                direction.z * ((1 - cosPitch) * right.y * right.z - sinPitch * right.x),

            direction.x * ((1 - cosPitch) * right.z * right.x - sinPitch * right.y) +
                direction.y * ((1 - cosPitch) * right.z * right.y + sinPitch * right.x) +
                direction.z * (cosPitch + (1 - cosPitch) * right.z * right.z)
        ).normalize();

        right = direction.clone().cross(this.up).normalize();
        // Atualiza o vetor 'up' da câmera, que é recalculado com base no 'right' e na nova direção
        this.up = right.clone().cross(direction).normalize();

        this.target = this.position.clone().add(direction);
    }

    yaw(angle) {
        let direction = this.target.clone().subtract(this.position).normalize();

        let right = direction.clone().cross(this.up).normalize();

        const cosYaw = Math.cos(angle);
        const sinYaw = Math.sin(angle);
        direction = new Vec3(
            direction.x * (cosYaw + (1 - cosYaw) * this.up.x * this.up.x) +
                direction.y * ((1 - cosYaw) * this.up.x * this.up.y - sinYaw * this.up.z) +
                direction.z * ((1 - cosYaw) * this.up.x * this.up.z + sinYaw * this.up.y),

            direction.x * ((1 - cosYaw) * this.up.y * this.up.x + sinYaw * this.up.z) +
                direction.y * (cosYaw + (1 - cosYaw) * this.up.y * this.up.y) +
                direction.z * ((1 - cosYaw) * this.up.y * this.up.z - sinYaw * this.up.x),

            direction.x * ((1 - cosYaw) * this.up.z * this.up.x - sinYaw * this.up.y) +
                direction.y * ((1 - cosYaw) * this.up.z * this.up.y + sinYaw * this.up.x) +
                direction.z * (cosYaw + (1 - cosYaw) * this.up.z * this.up.z)
        ).normalize();


        // Atualiza o alvo (target) da câmera
        this.target = this.position.clone().add(direction);
    }

    roll(angle) {
        let direction = this.target.clone().subtract(this.position).normalize();

        const cosAngle = Math.cos(angle);
        const sinAngle = Math.sin(angle);

        // Gira o vetor 'up' em torno do eixo 'direction'
        this.up = new Vec3(
            this.up.x * (cosAngle + (1 - cosAngle) * direction.x * direction.x) +
                this.up.y * ((1 - cosAngle) * direction.x * direction.y - sinAngle * direction.z) +
                this.up.z * ((1 - cosAngle) * direction.x * direction.z + sinAngle * direction.y),

            this.up.x * ((1 - cosAngle) * direction.y * direction.x + sinAngle * direction.z) +
                this.up.y * (cosAngle + (1 - cosAngle) * direction.y * direction.y) +
                this.up.z * ((1 - cosAngle) * direction.y * direction.z - sinAngle * direction.x),

            this.up.x * ((1 - cosAngle) * direction.z * direction.x - sinAngle * direction.y) +
                this.up.y * ((1 - cosAngle) * direction.z * direction.y + sinAngle * direction.x) +
                this.up.z * (cosAngle + (1 - cosAngle) * direction.z * direction.z)
        ).normalize();

        // Gira o vetor 'right' em torno do eixo 'direction'
        const right = direction.clone().cross(this.up).normalize();

        // Atualiza o vetor 'up' da câmera baseado no roll
        this.up = right.clone().cross(direction).normalize();
    }

    zoom(distance) {
        if (this.transition === 0) { // Projeção ortogonal
            const zoomFactor = 1 - distance; // Reduz os limites proporcionalmente
            const minZoom = 0.1; // Define o zoom mínimo para evitar inversões
            const maxZoom = 10;  // Define o zoom máximo
            
            // Calcula os novos limites respeitando os limites de zoom
            const newLeft = this.left * zoomFactor;
            const newRight = this.right * zoomFactor;
            const newBottom = this.bottom * zoomFactor;
            const newTop = this.top * zoomFactor;

            // Garante que os limites não excedam os valores mínimos ou máximos
            if (Math.abs(newRight - newLeft) > minZoom && Math.abs(newTop - newBottom) > minZoom) {
                this.left = newLeft;
                this.right = newRight;
                this.bottom = newBottom;
                this.top = newTop;
            }
        } else { // Projeção perspectiva
            // Calcula a direção de visão
            let direction = this.target.clone().subtract(this.position).normalize();

            // Ajusta a posição da câmera na direção de visão
            this.position.add(direction.multiply(distance));
        }
    }
    
    adjustOrthogonalBounds() {
        let distance = this.position.clone().magnitude();

        const scaleFactor = distance * 1;
        this.left = -scaleFactor;
        this.right = scaleFactor;
        this.bottom = -scaleFactor;
        this.top = scaleFactor;
    }

    setAspectRatio(aspectRatio) {
        this.camera.aspect = aspectRatio
        return this
    }
}

export default Camera;
