import Scene from "../core/scene.js";
import Cube from "../objects/cube/cube.js";
import Plane from "../objects/plane/plane.js";

class Scene1 extends Scene{
    init() {
        var c = new Cube(this.engine, "Cube")
        var p = new Plane(this.engine, "Plane")
        p.tranform.rotation.x = 90
        p.tranform.scale.x = 10
        p.tranform.scale.z = 10
        p.tranform.scale.y = 10

        this.add(c) 
        c.tranform.position.y = 1
        c.tranform.rotation.y = -180
        // c.tranform.scale.x = 0.5
        // c.tranform.scale.z = 0.5
        // c.tranform.scale.y = 0.5
        this.add(p) 
        // this.camera.position.y = 1
        this.tick = performance.now()
    }

    update(deltaTime) {

        this.tick = performance.now() / 1000

        // this.camera.position.x = Math.cos(this.tick) * this.camera.position.y
        // this.camera.position.y = 3 + Math.sin(this.tick) * 2
        // this.camera.position.z = Math.sin(this.tick) * this.camera.position.y

        // this.camera.transition = Math.abs(Math.sin(this.tick) / 10)
        
        // console.log(deltaTime);
        
        // this.camera.position.y = 10
        // this.camera.position.x = 10
        // this.camera.position.z = 10

        this.objects.map((obj) => {
            obj.setViewMatrix(this.camera.viewMatrix)
            obj.setProjectionMatrix(this.camera.projectionMatrix)
            if (obj.type === "Cube") {
                // obj.tranform.rotation.y -= 1
            }
            // obj.tranform.rotation.y += 0.5
            // obj.tranform.rotation.z += 0.5

            // obj.tranform.position.z -= 0.1
        })
    }
}

export default Scene1