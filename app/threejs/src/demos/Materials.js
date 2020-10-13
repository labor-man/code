import * as THREE from 'three'
import * as dat from 'dat.gui'
import React, { useRef, useEffect } from 'react'

const main = canvas => {
    let renderer,
        camera,
        scene,
        objects = [],
        gui

    renderer = new THREE.WebGLRenderer({canvas})
    renderer.setClearColor(new THREE.Color(0xcccccc))
    scene = new THREE.Scene()
    gui = new dat.GUI()

    {   //  camera
        const fov = 75
        const aspect = canvas.clientWidth/canvas.clientHeight
        const near = 0.1
        const far = 60
        camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
        camera.position.set(0, 5, 30)
    }

    {   //  scene
        {   //  Torus Knot
            const radius = 3.5;
            const tube = 1.5;
            const radialSegments = 8;
            const tubularSegments = 64;
            const p = 2;
            const q = 3;
            const geo = new THREE.TorusKnotBufferGeometry(radius, tube, tubularSegments, radialSegments, p, q);
            const mat = new THREE.MeshPhongMaterial({color:'cyan'})
            const mesh = new THREE.Mesh(geo, mat)
            scene.add(mesh)
            mesh.position.set(-10, 10, 0)
            objects.push(mesh)
        }

        {   //  Torus Knot
            const radius = 3.5;
            const tube = 1.5;
            const radialSegments = 8;
            const tubularSegments = 64;
            const p = 2;
            const q = 3;
            const geo = new THREE.TorusKnotBufferGeometry(radius, tube, tubularSegments, radialSegments, p, q);
            const mat = new THREE.MeshNormalMaterial()
            const mesh = new THREE.Mesh(geo, mat)
            scene.add(mesh)
            mesh.position.set(10, 10, 0)
            objects.push(mesh)
        }

        {   //  Torus Knot
            const radius = 3.5;
            const tube = 1.5;
            const radialSegments = 8;
            const tubularSegments = 64;
            const p = 2;
            const q = 3;
            const geo = new THREE.TorusKnotBufferGeometry(radius, tube, tubularSegments, radialSegments, p, q);
            const mat = new THREE.MeshPhysicalMaterial({color:0x897172})
            const mesh = new THREE.Mesh(geo, mat)
            scene.add(mesh)
            mesh.position.set(-10, -10, 0)
            objects.push(mesh)
        }

        {   //  Torus Knot
            const radius = 3.5;
            const tube = 1.5;
            const radialSegments = 8;
            const tubularSegments = 64;
            const p = 2;
            const q = 3;
            const geo = new THREE.SphereBufferGeometry(5, 10, 10);
            const mat = new THREE.MeshNormalMaterial({flatShading:true})
            const mesh = new THREE.Mesh(geo, mat)
            scene.add(mesh)
            mesh.position.set(10, -10, 0)
            objects.push(mesh)
        }

        {   //  box
            const box = new THREE.Object3D()
            scene.add(box)
            objects.push(box)
            const geo = new THREE.PlaneBufferGeometry(3,3)
            {   //  planes
                const mat1 = new THREE.MeshPhongMaterial({color:'purple', side:THREE.DoubleSide})
                const plane1 = new THREE.Mesh(geo, mat1)
                plane1.position.set(0, 0, -2)
                box.add(plane1)

                const mat2 = new THREE.MeshPhongMaterial({color:'yellow', side:THREE.DoubleSide})
                const plane2 = new THREE.Mesh(geo, mat2)
                plane2.position.set(0, 0, 2)
                box.add(plane2)

                const mat3 = new THREE.MeshPhongMaterial({color:'red', side:THREE.DoubleSide})
                const plane3 = new THREE.Mesh(geo, mat3)
                plane3.position.set(-2, 0, 0)
                plane3.rotation.y = Math.PI*.5
                box.add(plane3)

                const mat4 = new THREE.MeshPhongMaterial({color:'blue', side:THREE.DoubleSide})
                const plane4 = new THREE.Mesh(geo, mat4)
                plane4.position.set(2, 0, 0)
                plane4.rotation.y = Math.PI*-.5
                box.add(plane4)

                const mat5 = new THREE.MeshPhongMaterial({color:'green', side:THREE.DoubleSide})
                const plane5 = new THREE.Mesh(geo, mat5)
                plane5.position.set(0, -2, 0)
                plane5.rotation.x = Math.PI*-.5
                box.add(plane5)

                const mat6 = new THREE.MeshPhongMaterial({color:'cyan', side:THREE.DoubleSide})
                const plane6 = new THREE.Mesh(geo, mat6)
                plane6.position.set(0, 2, 0)
                plane6.rotation.x = Math.PI*.5
                box.add(plane6)
            }

        }

        {   //  light
            const color = 0xffffff
            const intensity = 2
            const light = new THREE.PointLight(color, intensity)
            light.position.set(20, 20, 20)
            scene.add(light)
        }
    }

    {   //  render
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
            });


            renderer.render(scene, camera)

        }
        requestAnimationFrame(render)
    }
}

export default () => {
    const canvasRef = useRef()

    useEffect(_ => {
        const canvas = canvasRef.current
        main(canvas)
    }, [])

    return <canvas className='canvas' ref={canvasRef}/>
}
