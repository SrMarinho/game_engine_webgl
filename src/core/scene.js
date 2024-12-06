import Renderer from "./renderer.js";

export default class Scene {
    constructor(gl) {
        this.gl = gl
        this.objects = [];
        this.lights = [];
        this.camera = null
        this.renderer = new Renderer(this.gl)
        this.init()
    }

    init() {
        console.log('Init Scene');
    }

    update(deltaTime) {
    }

    render() {
        this.objects.forEach(obj => {
            this.renderer.render(obj)
        });
    }

    async add(object) {
        if (typeof object.init === 'function') {
            await object.init();
        }

        this.objects.push(object);
        return this;
    }


    addLight(light) {
        this.lights.push(light);
        return this
    }

    setCamera(camera) {
        this.camera = camera
        return this
    }
}
