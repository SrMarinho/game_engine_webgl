import Camera from './camera.js'
import Input from "./input.js";
import CameraController from "../systems/camera-controller.js";

export default class Engine {
    constructor(canvas) {
        this.canvas = canvas;
        this.gl = canvas.getContext('webgl2');
        
        if (!this.gl) {
            throw new Error('Falha ao inicializar o WebGL. Certifique-se de que o navegador suporta WebGL.');
        }

        this.gl.clearColor(0.2, 0.2, 0.2, 1.0);
        this.gl.enable(this.gl.BLEND);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);


        this.lastTime = 0;
        this.deltaTime = 0;
        this.isRunning = false;
        this.scene = null;

        this.input = new Input();
        this.cameraController = new CameraController(null, this.input);

        this.resizeCanvas()
        window.addEventListener('resize', () => this.resizeCanvas())
    }

    setScene(scene) {
        if (scene && typeof scene.init === 'function') {
            this.scene = scene;
            this.scene.init();
        } else {
            console.error('Cena inválida ou sem método init.');
        }
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.lastTime = performance.now();
        this.loop();
    }

    stop() {
        this.isRunning = false;
    }

    loop() {
        if (!this.isRunning) return;

        this.gl.clearDepth(1.0);        // Clear everything
        this.gl.enable(this.gl.DEPTH_TEST);  // Enable depth testing
        this.gl.depthFunc(this.gl.LEQUAL);   // Near things obscure far things
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        const currentTime = performance.now();
        this.deltaTime = (currentTime - this.lastTime) / 1000; // Converte para segundos
        this.lastTime = currentTime;

        this.update(this.deltaTime);
        this.render();

        requestAnimationFrame(() => this.loop());
    }

    update(deltaTime) {
        if (this.cameraController && typeof this.cameraController.update === 'function') {
            this.cameraController.update(deltaTime);
        }
        if (this.input && typeof this.input.update === 'function') {
            this.input.update(deltaTime);
        }
        if (this.camera && typeof this.camera.update === 'function') {
            this.camera.update(deltaTime);
        }
        if (this.scene && typeof this.scene.update === 'function') {
            this.scene.update(deltaTime);
        } else {
            console.warn('Cena não tem método update.');
        }
    }

    render() {
        if (this.scene && typeof this.scene.render === 'function') {
            this.scene.render(this.gl);
        } else {
            console.warn('Cena não tem método render.');
        }
    }

    resizeCanvas() {
        const devicePixelRatio = window.devicePixelRatio || 1;

        // Ajusta o tamanho do canvas para a resolução do dispositivo
        this.canvas.width = window.innerWidth * devicePixelRatio;
        this.canvas.height = window.innerHeight * devicePixelRatio; // Corrigido para innerHeight

        // Atualiza o viewport do WebGL
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);

        const aspectRatio = this.canvas.width / this.canvas.height;
        this.cameraController.setAspectRatio = aspectRatio;
    }
}
