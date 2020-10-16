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
        camera.position.set(0, 10, 20)

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

        function makeCameraGUI(gui, camera, name, onChangeFn){
            const folder = gui.addFolder(name)
            folder.add(camera, 'fov', 0, 90).onChange(onChangeFn)
            folder.add(camera, 'aspect', 0, 5).onChange(onChangeFn)
            folder.add(camera, 'near', 0, 10).onChange(onChangeFn)
            folder.add(camera, 'far', 10, 100).onChange(onChangeFn)
            folder.add(camera, 'zoom', 0, 5, 0.1).onChange(onChangeFn)
        }
        makeCameraGUI(gui, camera, 'camera', updateCamera)
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

        {   //  ambient light
            const color = 0xffffff
            const intensity = 0
            const light = new THREE.AmbientLight(color, intensity)
            scene.add(light)

            const folder = gui.addFolder('ambient light')

            folder.addColor(new ColorGUIHelper(light, 'color'), 'value').name('color')
            folder.add(light, 'intensity', 0, 2, 0.1)
        }

        {   //  hemi-sphere light
            const skyColor = 0xB1E1FF
            const groundColor = 'red'
            const intensity = 0
            const light = new THREE.HemisphereLight(skyColor, groundColor, intensity)
            scene.add(light)

            const folder = gui.addFolder('hemi-sphere light')

            folder.addColor(new ColorGUIHelper(light, 'color'), 'value').name('sky color')
            folder.addColor(new ColorGUIHelper(light, 'groundColor'), 'value').name('ground color')
            folder.add(light, 'intensity', 0, 2, 0.1)
        }

        {   //  directional light
            const color = 0xffffff
            const intensity = 0
            const light = new THREE.DirectionalLight(color, intensity)

            light.position.set(0, 10, 0)
            light.target.position.set(-5, 0, 0)

            scene.add(light)
            scene.add(light.target)

            // gui
            const directionalLightFolder = gui.addFolder('directional light')
            directionalLightFolder.addColor(new ColorGUIHelper(light, 'color'), 'value').name('color')
            directionalLightFolder.add(light, 'intensity', 0, 2, 0.1)


            //  helper
            const helper = new THREE.DirectionalLightHelper(light)
            // scene.add(helper)

            function updateHelper(){
                light.target.updateMatrixWorld();
                helper.update();
            }
            updateHelper()
            function makeXYZGUI(gui, vector3, name, onChangeFn){
                const folder = directionalLightFolder.addFolder(name)
                folder.add(vector3, 'x', -10, 10).onChange(onChangeFn)
                folder.add(vector3, 'y', 0, 10).onChange(onChangeFn)
                folder.add(vector3, 'z', -10, 10).onChange(onChangeFn)
                folder.open()
            }
            makeXYZGUI(directionalLightFolder, light.position, 'position', updateHelper)
            makeXYZGUI(directionalLightFolder, light.target.position, 'target position', updateHelper)
        }

        {   //  point light
            const color = 0xffffff
            const intensity = 0
            const light = new THREE.PointLight(color, intensity)

            light.position.set(0, 10, 0)
            scene.add(light)

            const pointLightFolder = gui.addFolder('point light')
            pointLightFolder.addColor(new ColorGUIHelper(light, 'color'), 'value').name('color')
            pointLightFolder.add(light, 'intensity', 0, 2)
            pointLightFolder.add(light, 'distance', 0, 30)

            //helper
            const helper = new THREE.PointLightHelper(light)
            // scene.add(helper)

            function updateHelper(){
                helper.update()
            }
            updateHelper()

            function makeXYZGUI(gui, vector3, name, onChangeFn){
                const folder = pointLightFolder.addFolder(name)
                folder.add(vector3, 'x', -10, 10).onChange(onChangeFn)
                folder.add(vector3, 'y', 0, 10).onChange(onChangeFn)
                folder.add(vector3, 'z', -10, 10).onChange(onChangeFn)
                folder.open()
            }

            makeXYZGUI(pointLightFolder, light.position, 'position', updateHelper)
        }

        {   //  spot light
            const color = 0xffffff
            const intensity = 1
            const light = new THREE.SpotLight(color, intensity)
            light.position.set(0, 10, 0)

            scene.add(light)
            scene.add(light.target)

            //helper
            const helper = new THREE.SpotLightHelper(light)
            scene.add(helper)

            // gui
            function updateHelper(){
                helper.update()
            }
            updateHelper()

            function makeXYZGUI(gui, vector3, name, onChangeFn){
                const folder = spotLightFolder.addFolder(name)
                folder.add(vector3, 'x', -10, 10).onChange(onChangeFn)
                folder.add(vector3, 'y', 0, 10).onChange(onChangeFn)
                folder.add(vector3, 'z', -10, 10).onChange(onChangeFn)
                folder.open()
            }

            const spotLightFolder = gui.addFolder('spot folder')
            spotLightFolder.addColor(new ColorGUIHelper(light, 'color'), 'value').name('color')
            spotLightFolder.add(light, 'intensity', 0, 2)
            const lightAngleControler = spotLightFolder.add(light, 'angle', 0, Math.PI*0.5, 0.01)
            lightAngleControler.onChange(() => {
                updateHelper()
            })
            spotLightFolder.add(light, 'penumbra', 0, 1, 0.01)



            makeXYZGUI(spotLightFolder, light.position, 'position', updateHelper)
            makeXYZGUI(spotLightFolder, light.target.position, 'target', updateHelper)

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
