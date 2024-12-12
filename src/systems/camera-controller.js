class CameraController {
    constructor(camera, input) {
        this.camera = camera;
        this.input = input;

        this.moveSpeed = 10.0; // Velocidade de movimento
        this.rotationSpeed = 0.05; // Sensibilidade de rotação para teclas
    }

    update(deltaTime) {
        // Movimentação com teclado
        let forward = 0;
        let right = 0;
        let up = 0;
        let yaw = 0;    // Rotação horizontal
        let pitch = 0;  // Rotação vertical
        let roll = 0

        // Captura entrada do teclado para movimentação
        if (this.input.isKeyPressed("w")) forward += 1;
        if (this.input.isKeyPressed("s")) forward -= 1;
        if (this.input.isKeyPressed("a")) right -= 1;
        if (this.input.isKeyPressed("d")) right += 1;

        // Controle de zoom com scroll
        // if (this.input.isScrollUp()) this.camera.zoom(0.5);
        // if (this.input.isScrollDown()) this.camera.zoom(-0.5);

        // Captura entrada do teclado para rotação
        if (this.input.isKeyPressed("arrowLeft")) yaw += this.rotationSpeed;
        if (this.input.isKeyPressed("arrowRight")) yaw -= this.rotationSpeed;
        if (this.input.isKeyPressed("arrowUp")) pitch += this.rotationSpeed;
        if (this.input.isKeyPressed("arrowDown")) pitch -= this.rotationSpeed;
        if (this.input.isKeyPressed("q")) roll -= this.rotationSpeed;
        if (this.input.isKeyPressed("e")) roll += this.rotationSpeed;

        // Aplica movimentação
        this.camera.move(deltaTime, forward * this.moveSpeed, right * this.moveSpeed, up * this.moveSpeed);

        // Aplica rotação
        this.camera.rotate(yaw, pitch, roll);
        
    }
}

export default CameraController;
