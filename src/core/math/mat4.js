class Mat4 {
    constructor(elements) {
        if (elements) {
           this._elements = elements 
        } else {
            this._elements = [
                [1, 0, 0, 0],
                [0, 1, 0, 0],
                [0, 0, 1, 0],
                [0, 0, 0, 1]
            ];
        }
    }

    // Define como matriz identidade
    identity() {
        this._elements = [
            [1, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1]
        ];
    }

    get() {
        return this._elements;
    }

    // Multiplica por outra matriz
    multiply(mat) {
        const a = this._elements;
        const b = mat._elements;
        const result = new Array(4).fill().map(() => new Array(4).fill(0));

        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                for (let i = 0; i < 4; i++) {
                    result[row][col] += a[row][i] * b[i][col];
                }
            }
        }

        // Atualiza o estado do objeto com a matriz resultante
        this._elements = result;
    }

    // Cria uma matriz de translação e aplica
    translate(vec3) {
        const translation = new Mat4();
        translation._elements = [
            [1, 0, 0, vec3.x],
            [0, 1, 0, vec3.y],
            [0, 0, 1, vec3.z],
            [0, 0, 0, 1]
        ];

        // Atualiza o estado do objeto com a matriz de translação multiplicada
        this.multiply(translation);
    }
    
    scale(vec3) {
        const scaling = new Mat4();
        scaling._elements = [
            [vec3.x, 0, 0, 0],
            [0, vec3.y, 0, 0],
            [0, 0, vec3.z, 0],
            [0, 0, 0, 1]
        ];

        // Atualiza o estado do objeto com a matriz de escala multiplicada
        this.multiply(scaling);
    }


    // Rotaciona em torno do eixo X
    rotateX(angle) {
        const rad = angle * (Math.PI / 180); // Converter de graus para radianos
        const rotation = new Mat4();
        rotation._elements = [
            [1, 0, 0, 0],
            [0, Math.cos(rad), -Math.sin(rad), 0],
            [0, Math.sin(rad), Math.cos(rad), 0],
            [0, 0, 0, 1]
        ];

        // Atualiza o estado do objeto com a matriz de rotação multiplicada
        this.multiply(rotation);
    }

    // Rotaciona em torno do eixo Y
    rotateY(angle) {
        const rad = angle * (Math.PI / 180); // Converter de graus para radianos
        const rotation = new Mat4();
        rotation._elements = [
            [Math.cos(rad), 0, Math.sin(rad), 0],
            [0, 1, 0, 0],
            [-Math.sin(rad), 0, Math.cos(rad), 0],
            [0, 0, 0, 1]
        ];

        // Atualiza o estado do objeto com a matriz de rotação multiplicada
        this.multiply(rotation);
    }

    // Rotaciona em torno do eixo Z
    rotateZ(angle) {
        const rad = angle * (Math.PI / 180); // Converter de graus para radianos
        const rotation = new Mat4();
        rotation._elements = [
            [Math.cos(rad), -Math.sin(rad), 0, 0],
            [Math.sin(rad), Math.cos(rad), 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1]
        ];

        // Atualiza o estado do objeto com a matriz de rotação multiplicada
        this.multiply(rotation);
    }

    rotate({x, y, z}) {
        this.rotateX(x)
        this.rotateY(y)
        this.rotateZ(z)
    }

    clone() {
        return new Mat4(this._elements)
    }

    transpose() {
        const transposed = new Array(4).fill().map(() => new Array(4).fill(0));

        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                transposed[col][row] = this._elements[row][col];
            }
        }

        // Atualiza o estado da matriz atual
        this._elements = transposed;
    }
}

export default Mat4;
