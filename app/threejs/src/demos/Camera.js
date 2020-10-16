import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'dat.gui'
import React, { useRef, useEffect } from 'react'

const main = (canvas) => {
    let renderer,
        camera,
        scene,
        objects = [],
        gui

    renderer = new THREE.WebGLRenderer({canvas})
    renderer.setClearColor(new THREE.Color(0xcccccc))
    scene = new THREE.Scene()
    gui = new dat.GUI()

    class ColorGUIHelper{
        constructor(object, prop){
            this.object = object
            this.prop = prop
        }

        get value(){
            return `#${this.object[this.prop].getHexString()}`;
        }

        set value(value){
            this.object[this.prop].set(value)
        }
    }

    {   //  camera
        const fov = 45
        const aspect = canvas.clientWidth/canvas.clientHeight
        const near = 0.1
        const far = 100

        camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
        camera.position.set(0, 20, 30)

        const controls = new OrbitControls(camera, canvas)
        controls.target.set(0, 5, 0)
        controls.update()   //  controls will use the new target.

        // helper
        // const helper = new THREE.CameraHelper(camera)
        // scene.add(helper)

        function updateCamera(){
            camera.updateProjectionMatrix();
            // helper.update()
        }
        updateCamera()

        class MinMaxGUIHelper {
          constructor(obj, minProp, maxProp, minDif) {
            this.obj = obj;
            this.minProp = minProp;
            this.maxProp = maxProp;
            this.minDif = minDif;
          }
          get min() {
            return this.obj[this.minProp];
          }
          set min(v) {
            this.obj[this.minProp] = v;
            this.obj[this.maxProp] = Math.max(this.obj[this.maxProp], v + this.minDif);
          }
          get max() {
            return this.obj[this.maxProp];
          }
          set max(v) {
            this.obj[this.maxProp] = v;
            this.min = this.min;  // this will call the min setter
          }
        }

        gui.add(camera, 'fov', 0, 180).onChange(updateCamera)
        const minMaxGUIHelper = new MinMaxGUIHelper(camera, 'near', 'far', 0.1)
        gui.add(minMaxGUIHelper, 'min', .1, 50, 0.1).name('near').onChange(updateCamera)
        gui.add(minMaxGUIHelper, 'max', .1, 50.1, 0.1).name('far').onChange(updateCamera)


    }

    {   //  scene
        {   //  ground
            const loader = new THREE.TextureLoader()
            loader.load('https://threejsfundamentals.org/threejs/resources/images/checker.png', texture => {
                const planeSize = 40
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                texture.magFilter = THREE.NearestFilter;

                const repeats = planeSize/2
                texture.repeat.set(repeats, repeats)

                const geo = new THREE.PlaneBufferGeometry(planeSize, planeSize)
                const mat = new THREE.MeshPhongMaterial({map:texture, side:THREE.DoubleSide})
                const plane = new THREE.Mesh(geo, mat)
                plane.rotation.x = Math.PI*-.5
                scene.add(plane)
            })
        }

        {   //  cube
            const cubeSize = 4;
            const cubeGeo = new THREE.BoxBufferGeometry(cubeSize, cubeSize, cubeSize);
            const cubeMat = new THREE.MeshPhongMaterial({color: '#8AC'});
            const mesh = new THREE.Mesh(cubeGeo, cubeMat);
            mesh.position.set(cubeSize + 1, cubeSize / 2, 0);
            scene.add(mesh);
        }

        {   //  cube
            const sphereRadius = 3;
            const sphereWidthDivisions = 32;
            const sphereHeightDivisions = 16;
            const sphereGeo = new THREE.SphereBufferGeometry(sphereRadius, sphereWidthDivisions, sphereHeightDivisions);
            const sphereMat = new THREE.MeshPhongMaterial({color: '#CA8'});
            const mesh = new THREE.Mesh(sphereGeo, sphereMat);
            mesh.position.set(-sphereRadius - 1, sphereRadius + 2, 0);
            scene.add(mesh);
        }

        {   //  hemi-sphere light
            const skyColor = 0xB1E1FF
            const groundColor = 'red'
            const intensity = 1
            const light = new THREE.HemisphereLight(skyColor, groundColor, intensity)
            scene.add(light)

            const folder = gui.addFolder('hemi-sphere light')

            folder.addColor(new ColorGUIHelper(light, 'color'), 'value').name('sky color')
            folder.addColor(new ColorGUIHelper(light, 'groundColor'), 'value').name('ground color')
            folder.add(light, 'intensity', 0, 2, 0.1)
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

    useEffect(_ => {
        const canvas = canvasRef.current
        main(canvas)
    }, [])

    return (
        <div style={{width:'100%', height:'100%'}}>
            <canvas className='canvas' ref={canvasRef}/>
        </div>
    )
}
