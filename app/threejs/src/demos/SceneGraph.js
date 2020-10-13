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
    scene = new THREE.Scene()
    gui = new dat.GUI()

    {   //  camera
        const fov = 75
        const aspect = canvas.clientWidth/canvas.clientHeight
        const near = 0.1
        const far = 60
        camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
        camera.position.set(0, 30 ,0)
        camera.up.set(0, 0, 1)
        camera.lookAt(0, 0, 0)
    }

    {   //  scene(solar system)
        // heplers
        class AxesGridHelper{
            constructor(node, units){
                this._visible = false

                const axesHelper = new THREE.AxesHelper()
                axesHelper.material.depthTest = false   // will not check to see if they are drawing behind something else
                axesHelper.renderOrder = 3    //  // drawn order(default is 0)
                axesHelper.visible = this.visible
                node.add(axesHelper)

                const gridHelper = new THREE.GridHelper(units, units)
                gridHelper.material.depthTest = false
                gridHelper.renderOrder = 1
                gridHelper.visible = this._visible
                node.add(gridHelper)

                this.axesHelper = axesHelper
                this.gridHelper = gridHelper

            }

            get visible(){
                return this._visible
            }
            set visible(visible){
                this._visible = visible
                this.axesHelper.visible = visible
                this.gridHelper.visible = visible
            }
        }

        function makeAxesGridHelperWithGUI(node, label, units = 10){
            const axesGridHelperObject = new AxesGridHelper(node, units)
            gui.add(axesGridHelperObject, 'visible').name(label)
        }

        //  solar system
        const radus = 1
        const widthSegments = 6
        const heightSegments = 6
        const geo = new THREE.SphereBufferGeometry(radus, widthSegments, heightSegments)

        const solarSystem = new THREE.Object3D()
        scene.add(solarSystem)
        objects.push(solarSystem)
        makeAxesGridHelperWithGUI(solarSystem, 'solar system', 20)



        {   //  sun
            const mat = new THREE.MeshPhongMaterial({emissive:'yellow'})

            const mesh = new THREE.Mesh(geo, mat)
            mesh.scale.set(5, 5, 5)

            solarSystem.add(mesh)
            objects.push(mesh)
            makeAxesGridHelperWithGUI(mesh, 'sun')
        }

        {   //  earth-moon system
            const earthAndMoonSystem = new THREE.Object3D()
            earthAndMoonSystem.position.set(10, 0, 0)
            solarSystem.add(earthAndMoonSystem)
            objects.push(earthAndMoonSystem)
            makeAxesGridHelperWithGUI(earthAndMoonSystem, 'earth-moon system')
            {   //earth
                const mat = new THREE.MeshPhongMaterial({color:0x2233FF, emissive:0x112244})

                const mesh = new THREE.Mesh(geo, mat)

                earthAndMoonSystem.add(mesh)
                objects.push(mesh)
                makeAxesGridHelperWithGUI(mesh, 'earth')
            }

            {   //  moon
                const mat = new THREE.MeshPhongMaterial({color: 0x888888, emissive: 0x222222})

                const mesh = new THREE.Mesh(geo, mat)
                mesh.position.set(2, 0, 0)
                mesh.scale.set(0.3, 0.3, 0.3)

                earthAndMoonSystem.add(mesh)
                objects.push(mesh)
                makeAxesGridHelperWithGUI(mesh, 'moon')
            }
        }

        {   //  earth-moon system 2
            const earthAndMoonSystem = new THREE.Group()
            earthAndMoonSystem.position.set(0, 0, 10)
            solarSystem.add(earthAndMoonSystem)
            objects.push(earthAndMoonSystem)
            {   //earth
                const mat = new THREE.MeshPhongMaterial({ emissive:0x112244})

                const mesh = new THREE.Mesh(geo, mat)

                earthAndMoonSystem.add(mesh)
                objects.push(mesh)
            }

            {   //  moon
                const mat = new THREE.MeshPhongMaterial({color: 0x888888, emissive: 0x222222})

                const mesh = new THREE.Mesh(geo, mat)
                mesh.position.set(2, 0, 0)
                mesh.scale.set(0.3, 0.3, 0.3)

                earthAndMoonSystem.add(mesh)
                objects.push(mesh)
            }
        }


        {   //  light
            const color = 0xffffff
            const intensity = 3
            const light = new THREE.PointLight(color, intensity)
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
