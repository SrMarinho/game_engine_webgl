import Engine from './src/core/engine.js'
import Scene1 from './src/scenes/scene1.js';
import Camera from './src/core/camera.js';


function main() {
   var canvas = document.getElementById('myCanvas') 

   const engine = new Engine(canvas)

   const camera1 = new Camera()

   var scene = new Scene1(engine)

   engine.cameraController.setCamera(camera1)

   engine.setScene(scene)

   engine.start()
}

window.addEventListener("load", () => {
    main()
})