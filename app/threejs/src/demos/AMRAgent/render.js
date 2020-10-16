import * as THREE from 'three'

function resizeRendererToDisplaySize(renderer) {
  const canvas = renderer.domElement;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
    renderer.setSize(width, height, false);
  }
  return needResize;
}

export default (renderer, scene, camera, objects) => {
    const render = time => {
        requestAnimationFrame(render)

        time *= 0.001

        //   responsive design
        if (resizeRendererToDisplaySize(renderer)) {
          const canvas = renderer.domElement;
          camera.aspect = canvas.clientWidth / canvas.clientHeight;
          camera.updateProjectionMatrix();
        }

        objects.forEach((object, i) => {
            object.rotation.y = time*(i+1)/10
            object.rotation.x = time*(i+1)/10
        });
        renderer.render(scene, camera)

    }
    requestAnimationFrame(render)
}
