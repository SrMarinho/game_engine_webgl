import Scene from "../core/scene.js";
import Cube from "../objects/cube/cube.js";
import Camera from '../core/camera.js'

class Scene1 extends Scene{
    init() {

        this.camera = new Camera(); 

        var c = new Cube(this.gl)
        // c.tranform.scale.x = 0.5
        // c.tranform.scale.z = 0.5
        // c.tranform.scale.y = 0.5

        // c.tranform.rotation.y = 45
        this.add(c) 
        // this.camera.position.y = 1
        this.tick = performance.now()
    }

    update(deltaTime) {

        this.tick = performance.now() / 1000

        // this.camera.position.z += 0.01
        // console.log(deltaTime);
        
        // this.camera.position.y = 10
        // this.camera.position.x = 10
        // this.camera.position.z = 10

        this.camera.update()

        this.objects.map((obj) => {
            obj.setViewMatrix(this.camera.viewMatrix)
            obj.setProjectionMatrix(this.camera.projectionMatrix)
            // obj.tranform.rotation.x += 0.5
            // obj.tranform.rotation.y += 0.5
            // obj.tranform.rotation.z += 0.5

            // obj.tranform.position.z -= 0.1
        })
    }
}

export default Scene1