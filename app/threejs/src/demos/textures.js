import * as THREE from 'three'
import * as dat from 'dat.gui'
import React, { useRef, useEffect, useState } from 'react'

const main = (canvas, setProgress) => {
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
        camera.position.z = 20
    }

    {   //  scene
        const loader = new THREE.TextureLoader()
        const geo = new THREE.BoxBufferGeometry(5, 5, 5)
        {   //  box1
            const mat = new THREE.MeshPhongMaterial({map:loader.load('https://threejsfundamentals.org/threejs/resources/images/wall.jpg')})

            const box = new THREE.Mesh(geo, mat)
            box.position.set(-12, 10, 0)
            scene.add(box)
            objects.push(box)
        }

        {   //  box2
            let mats = [
                new THREE.MeshPhongMaterial({map:loader.load('https://threejsfundamentals.org/threejs/resources/images/flower-1.jpg')}),
                new THREE.MeshPhongMaterial({map:loader.load('https://threejsfundamentals.org/threejs/resources/images/flower-2.jpg')}),
                new THREE.MeshPhongMaterial({map:loader.load('https://threejsfundamentals.org/threejs/resources/images/flower-3.jpg')}),
                new THREE.MeshPhongMaterial({map:loader.load('https://threejsfundamentals.org/threejs/resources/images/flower-4.jpg')}),
                new THREE.MeshPhongMaterial({map:loader.load('https://threejsfundamentals.org/threejs/resources/images/flower-5.jpg')}),
                new THREE.MeshPhongMaterial({map:loader.load('https://threejsfundamentals.org/threejs/resources/images/flower-6.jpg')})
            ]

            const box = new THREE.Mesh(geo, mats)
            box.position.set(0, 10, 0)
            scene.add(box)
            objects.push(box)
        }

        {   //  box3
            loader.load('https://threejsfundamentals.org/threejs/resources/images/wall.jpg', texture => {
                const mat = new THREE.MeshPhongMaterial({map:texture})

                const box = new THREE.Mesh(geo, mat)
                box.position.set(-12, 0, 0)
                scene.add(box)
                objects.push(box)
            })
        }

        {   //  box4
            const loadingManager = new THREE.LoadingManager()
            const loader_ = new THREE.TextureLoader(loadingManager)
            let mats = [
                new THREE.MeshPhongMaterial({map:loader_.load('https://threejsfundamentals.org/threejs/resources/images/flower-1.jpg')}),
                new THREE.MeshPhongMaterial({map:loader_.load('https://threejsfundamentals.org/threejs/resources/images/flower-2.jpg')}),
                new THREE.MeshPhongMaterial({map:loader_.load('https://threejsfundamentals.org/threejs/resources/images/flower-3.jpg')}),
                new THREE.MeshPhongMaterial({map:loader_.load('https://threejsfundamentals.org/threejs/resources/images/flower-4.jpg')}),
                new THREE.MeshPhongMaterial({map:loader_.load('https://threejsfundamentals.org/threejs/resources/images/flower-5.jpg')}),
                new THREE.MeshPhongMaterial({map:loader_.load('https://threejsfundamentals.org/threejs/resources/images/flower-6.jpg')})
            ]

            loadingManager.onLoad = () => {
                const box = new THREE.Mesh(geo, mats)
                box.position.set(0, 0, 0)
                scene.add(box)
                objects.push(box)
            }

            loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
                const progress = Math.floor(itemsLoaded/itemsTotal*100) + '%'
                setProgress(progress)
            }

        }

        {   //  box5
            loader.load('https://threejsfundamentals.org/threejs/resources/images/wall.jpg', texture => {
                texture.wrapS = THREE.RepeatWrapping
                texture.wrapT = THREE.RepeatWrapping
                texture.repeat.set(2, 2)
                const mat = new THREE.MeshPhongMaterial({map:texture})

                const box = new THREE.Mesh(geo, mat)
                box.position.set(12, 10, 0)
                scene.add(box)
                objects.push(box)
            })
        }

        {   //  box6
            loader.load('https://threejsfundamentals.org/threejs/resources/images/wall.jpg', texture => {
                texture.wrapS = THREE.RepeatWrapping
                texture.wrapT = THREE.RepeatWrapping
                const xOffset = .5
                const yOffset = 0
                texture.offset.set(xOffset, 0)

                const mat = new THREE.MeshPhongMaterial({map:texture})

                const box = new THREE.Mesh(geo, mat)
                box.position.set(12, 0, 0)
                scene.add(box)
                objects.push(box)
            })
        }

        {   //  box7
            loader.load('https://threejsfundamentals.org/threejs/resources/images/wall.jpg', texture => {
                texture.center.set(.5, .5)
                texture.rotation = THREE.MathUtils.degToRad(45)

                const mat = new THREE.MeshPhongMaterial({map:texture})

                const box = new THREE.Mesh(geo, mat)
                box.position.set(-12, -10, 0)
                scene.add(box)
                objects.push(box)
            })
        }

        {   //  light1
            const color = 0xffffff
            const intensity = 2
            const light = new THREE.PointLight(color, intensity)
            light.position.set(20, 20, 20)
            scene.add(light)
        }

        {   //  light2
            const color = 0xffffff
            const intensity = 2
            const light = new THREE.PointLight(color, intensity)
            light.position.set(-20, -20, 0)
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
                object.rotation.x = time*(i+1)/10
            });


            renderer.render(scene, camera)

        }
        requestAnimationFrame(render)
    }
}

export default () => {
    const canvasRef = useRef()
    const [progress, setProgress] = useState('0%')

    useEffect(_ => {
        const canvas = canvasRef.current
        main(canvas, setProgress)
    }, [])

    return (
        <div style={{width:'100%', height:'100%'}}>
            <canvas className='canvas' ref={canvasRef}/>
            <span style={{position:'absolute', left:0, top:0}}>{progress}</span>
        </div>
    )
}
