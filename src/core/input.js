class Input {
    constructor() {
        this.keys = new Map(); // Armazena o estado das teclas
        this.mouse = { x: 0, y: 0, deltaX: 0, deltaY: 0 }; // Armazena o estado do mouse

        // Eventos de teclado
        window.addEventListener("keydown", (e) => this.keys.set(e.key.toLowerCase(), true));
        window.addEventListener("keyup", (e) => this.keys.set(e.key.toLowerCase(), false));

        // Eventos de mouse
        window.addEventListener("mousemove", (e) => {
            this.mouse.deltaX = e.movementX;
            this.mouse.deltaY = e.movementY;
        });

        // Reseta o delta após o loop
        window.addEventListener("mouseup", () => {
            this.mouse.deltaX = 0;
            this.mouse.deltaY = 0;
        });

        window.addEventListener("wheel", (event) => {
            this.scrollDelta = event.deltaY;
        });
    }

    update(deltaTime) {
        this.scrollDelta = 0;
    }

    isKeyPressed(key) {
        return this.keys.get(key.toLowerCase()) || false;
    }

    isScrollUp() {
        // Retorna verdadeiro se o scroll foi para cima
        return this.scrollDelta < 0;
    }

    isScrollDown() {
        // Retorna verdadeiro se o scroll foi para baixo
        return this.scrollDelta > 0;
    }

    getMouseDelta() {
        return { x: this.mouse.deltaX, y: this.mouse.deltaY };
    }
}

export default Input