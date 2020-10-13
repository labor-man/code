import * as THREE from 'three'

export default (aspect=2) => {
    const fov = 45
    const near = 0.1
    const far = 1000

    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
    camera.position.set(0, 20, 30)

    return camera
}
