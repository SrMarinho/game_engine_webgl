import Engine from './src/core/engine.js'
import Scene1 from './src/scenes/scene1.js';


function main() {
   var canvas = document.getElementById('myCanvas') 

   const engine = new Engine(canvas)

   var scene = new Scene1(engine)

   engine.setScene(scene)

   engine.start()
}

window.addEventListener("load", () => {
    main()
})