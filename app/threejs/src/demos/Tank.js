import * as THREE from 'three'
import * as dat from 'dat.gui'
import React, { useRef, useEffect } from 'react'

const main = canvas => {
    let renderer,
        camera,
        scene,
        objects = {},
        gui

    renderer = new THREE.WebGLRenderer({canvas})
    renderer.setClearColor(0xAAAAAA)
    // renderer.shadowMap.enabled = true;
    scene = new THREE.Scene()
    gui = new dat.GUI()

    {   //  cameras
        //  default camera
        const fov = 40
        const aspect = canvas.clientWidth/canvas.clientHeight
        const near = 0.1
        const far = 100
        camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
        camera.position.set(20, 10, 20)
        camera.lookAt(0, 0, 0)
    }

    {   //  scene
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


        {   //  ground
            const geo = new THREE.PlaneBufferGeometry(50, 50)
            const mat = new THREE.MeshPhongMaterial({color:0xCC8866})
            const mesh =  new THREE.Mesh(geo, mat)
            mesh.rotation.x = Math.PI * -0.5
            console.log('ground:', mesh)
            scene.add(mesh)
        }

        {   //  tank
            const tank = new THREE.Object3D()
            scene.add(tank)
            objects.tank = tank

            {   //  body
                const bodyWidth = 4,
                      bodyHeight = 1,
                      bodyLength = 8

                const geo = new THREE.BoxBufferGeometry(bodyWidth, bodyHeight, bodyLength)
                const mat = new THREE.MeshPhongMaterial({color:0x6688AA})

                const tankBody = new THREE.Mesh(geo, mat)
                tankBody.position.y = 1.5*bodyHeight
                tank.add(tankBody)

                {   //  wheels
                    const wheelRadius = bodyHeight
                    const wheelThickness = .5
                    const wheelSegments = 6
                    const wheelGeo = new THREE.CylinderBufferGeometry(wheelRadius, wheelRadius, wheelThickness, wheelSegments)

                    const wheelMat = new THREE.MeshPhongMaterial({color:0x888888})

                    const positions = [
                        [-bodyWidth/2-wheelThickness/2, -bodyHeight/2, bodyLength/3],
                        [bodyWidth/2+wheelThickness/2, -bodyHeight/2, bodyLength/3],
                        [-bodyWidth/2-wheelThickness/2, -bodyHeight/2, 0],
                        [bodyWidth/2+wheelThickness/2, -bodyHeight/2, 0],
                        [-bodyWidth/2-wheelThickness/2, -bodyHeight/2, -bodyLength/3],
                        [bodyWidth/2+wheelThickness/2, -bodyHeight/2, -bodyLength/3]
                    ]

                    const wheels = positions.map(position => {
                        const wheel = new THREE.Mesh(wheelGeo, wheelMat)
                        wheel.position.set(...position)
                        wheel.rotation.z = -.5*Math.PI
                        tankBody.add(wheel)
                        return wheel
                    })

                    objects.wheels = wheels
                }

                {   //  dome
                    const domeRadius = 2
                    const domeWidthSubdivisions = 12
                    const domeHeightSubdivisions = 12
                    //  没搞清这几个参数的规则，为什么水平是0-2PI，垂直就是0-PI，难道类似地球经纬线？
                    const domePhiStart = 0
                    const domePhiEnd = Math.PI*2
                    const domeThetaStart = 0
                    const domeThetaEnd = Math.PI*0.5
                    const domeGeo = new THREE.SphereBufferGeometry(domeRadius, domeWidthSubdivisions, domeHeightSubdivisions, domePhiStart, domePhiEnd, domeThetaStart, domeThetaEnd)
                    const domeMat = new THREE.MeshPhongMaterial({color:0x6688AA})

                    const domeMesh = new THREE.Mesh(domeGeo, domeMat)
                    domeMesh.position.y = bodyHeight/3
                    tankBody.add(domeMesh)
                }

                {   //  turret pivot
                    const turretPivot = new THREE.Object3D()
                    turretPivot.position.y = bodyHeight/2
                    tankBody.add(turretPivot)
                    objects.turretPivot = turretPivot
                    {   //turret
                        const turretWidth = 0.5
                        const turretHeight = 0.5
                        const turretLength = bodyLength*2/3
                        const turretGeo = new THREE.BoxBufferGeometry(turretWidth, turretHeight, turretLength)
                        const turretMat = new THREE.MeshPhongMaterial({color:0x6688AA})
                        const turretMesh = new THREE.Mesh(turretGeo, turretMat)
                        turretMesh.position.z = turretLength/2
                        turretMesh.position.y = turretHeight/2
                        turretPivot.add(turretMesh)
                    }
                }
            }
        }

        {   //  target orbit
            const targetOrbit = new THREE.Object3D()
            scene.add(targetOrbit)
            objects.targetOrbit = targetOrbit
            {   //target Elevation
                const targetElevation = new THREE.Object3D();
                targetElevation.position.z = 4;
                targetElevation.position.y = 8;
                targetOrbit.add(targetElevation)
                {   // target bob
                    const targetBob = new THREE.Object3D();
                    targetElevation.add(targetBob)
                    objects.targetBob = targetBob
                    {   //tartet
                        const targetGeo = new THREE.SphereBufferGeometry(.5, 6, 3)
                        const targetMat = new THREE.MeshPhongMaterial({color: 0x00FF00});
                        const targetmesh = new THREE.Mesh(targetGeo, targetMat)
                        targetBob.add(targetmesh)
                        objects.target = targetmesh
                    }
                }
            }
        }

        {   //  track
            const curve = new THREE.SplineCurve( [
              new THREE.Vector2( -10, 0 ),
              new THREE.Vector2( -5, 5 ),
              new THREE.Vector2( 0, 0 ),
              new THREE.Vector2( 5, -5 ),
              new THREE.Vector2( 10, 0 ),
              new THREE.Vector2( 5, 10 ),
              new THREE.Vector2( -5, 10 ),
              new THREE.Vector2( -10, -10 ),
              new THREE.Vector2( -15, -8 ),
              new THREE.Vector2( -10, 0 ),
            ] );



            const points = curve.getPoints(50)
            const lineGeo = new THREE.BufferGeometry().setFromPoints( points )
            const lineMat = new THREE.LineBasicMaterial({color:0xff0000})
            const trackLine = new THREE.Line(lineGeo, lineMat)
            trackLine.rotation.x = Math.PI*.5
            trackLine.position.y = 0.05
            scene.add(trackLine)


            objects.curve = curve
        }

        {   //  lights
            {   //  light1
                const light = new THREE.DirectionalLight(0xffffff, 1);
                light.position.set(0, 20, 0);
                scene.add(light);
                // light.castShadow = true;
                // light.shadow.mapSize.width = 2048;
                // light.shadow.mapSize.height = 2048;
                //
                // const d = 50;
                // light.shadow.camera.left = -d;
                // light.shadow.camera.right = d;
                // light.shadow.camera.top = d;
                // light.shadow.camera.bottom = -d;
                // light.shadow.camera.near = 1;
                // light.shadow.camera.far = 50;
                // light.shadow.bias = 0.001;

            }

            {   //  light2
                const light = new THREE.DirectionalLight(0xffffff, 1);
                light.position.set(1, 2, 4);
                scene.add(light);
            }
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

        const tankPosition = new THREE.Vector2()
        const tankLookPosition = new THREE.Vector2()
        const targetWorldPosition = new THREE.Vector3()
        const render = time => {
            requestAnimationFrame(render)

            time *= 0.001

            //   responsive design
            if (resizeRendererToDisplaySize(renderer)) {
              const canvas = renderer.domElement;
              camera.aspect = canvas.clientWidth / canvas.clientHeight;
              camera.updateProjectionMatrix();
            }

            {   //  move target
                const targetOrbit = objects.target
                const target = objects.target
                const targetBob = objects.targetBob
                targetOrbit.rotation.y = time * .27;
                targetBob.position.y = Math.sin(time * 2) * 4;
                target.rotation.x = time * 7;
                target.rotation.y = time * 13;
            }

            {   //  move tank
                const tank = objects.tank
                const curve = objects.curve
                const tankTime = time*.05
                curve.getPointAt(tankTime%1, tankPosition)
                curve.getPointAt((tankTime + 0.01)%1, tankLookPosition)
                tank.position.set(tankPosition.x, 0, tankPosition.y)
                tank.lookAt(tankLookPosition.x, 0, tankLookPosition.y)

            }

            {   //  face the turret to tartet
                const target = objects.target
                const turretPivot = objects.turretPivot
                target.getWorldPosition(targetWorldPosition)
                turretPivot.lookAt(targetWorldPosition)
            }

            {   //  wheels rotate
                const wheels = objects.wheels
                wheels.forEach((wheel, i) => {
                    wheel.rotation.x = time*10
                });

            }

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
