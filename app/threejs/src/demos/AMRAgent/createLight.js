import * as THREE from 'three'
import createLightControlGUI from './createLightControlGUI'

export default (container, gui) => {
    const color = 0xffffff
    const intensity = 1
    const light = new THREE.DirectionalLight(color, intensity)

    light.position.set(0, 10, 0)
    light.target.position.set(-5, 0, 0)

    container.add(light)
    container.add(light.target)

    if(gui){
        createLightControlGUI(gui, light, 'light')
    }
}
