import * as THREE from 'three'
import React, { useEffect, useRef } from 'react'

const main = canvas => {
    let renderer,
        camera,
        scene,
        meshes = []

    {   //  renderer
        renderer  = new THREE.WebGLRenderer({ canvas })
    }

    {   //  camera
        const fov = 75
        const aspect = 2
        const near = 0.1
        const far = 20
        camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
        camera.position.z = 10
    }

    {   //  scene
        scene = new THREE.Scene()
        scene.background = new THREE.Color('AntiqueWhite')
    }

    {   //  meshes
        {   //  box
            const mat = new THREE.MeshPhongMaterial({color:'cyan'})

            const width = 1
            const height = 1
            const depth = 1
            const boxGeo = new THREE.BoxBufferGeometry(width, height, depth)

            const cube = new THREE.Mesh(boxGeo, mat)
            cube.position.set(1, 1, 1)

            scene.add(cube)
            meshes.push(cube)
        }

        {   //  plane
            const mat = new THREE.MeshPhongMaterial({color:'tomato', side:THREE.DoubleSide})

            const width = 1
            const height = 1
            const planeGeo = new THREE.PlaneBufferGeometry(width, height)

            const plane = new THREE.Mesh(planeGeo, mat)
            plane.position.set(3, 3, 3)
            plane.doubleSided = true
            scene.add(plane)
            meshes.push(plane)
        }

        {   //  edgesGeo/lines
            const mat = new THREE.LineBasicMaterial({color:'black'})

            const width = 1
            const height = 1
            const depth = 1
            const thresholdAngle = 15
            const boxGeo = new THREE.BoxBufferGeometry(width, height, depth)

            const edgesGeo = new THREE.EdgesGeometry(
                boxGeo,
                thresholdAngle
            )

            const edges = new THREE.LineSegments(edgesGeo, mat)
            edges.position.set(-1, 1, 0)
            scene.add(edges)
            meshes.push(edges)
        }

        {   //  text
            const mat = new THREE.MeshPhongMaterial({color:'darkred'})
            const loader = new THREE.FontLoader()

            function loadFont(url) {
              return new Promise((resolve, reject) => {
                loader.load(url, resolve, undefined, reject);
              });
            }
            async function doit() {
              // const font = await loadFont('https://threejsfundamentals.org/threejs/resources/threejs/fonts/helvetiker_regular.typeface.json');
              const font = await loadFont('https://threejsfundamentals.org/threejs/resources/threejs/fonts/helvetiker_regular.typeface.json');
              const geometry = new THREE.TextBufferGeometry('AMR agent', {
                font: font,
                size: 2,
                height: .2,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 0.15,
                bevelSize: .3,
                bevelSegments: 5,
              });

                const mesh = new THREE.Mesh(geometry, mat);

                const parent = new THREE.Object3D();
                parent.add(mesh);
                parent.position.set(0, -5, 0)

                geometry.computeBoundingBox();
                geometry.boundingBox.getCenter(mesh.position).multiplyScalar(-1);

                scene.add(parent)
                meshes.unshift(parent)
            }

            doit()
        }

        {   //  points1
            const mat = new THREE.PointsMaterial({
                color:'darkseagreen',
                size:0.2 // in world units
            })

            const radius = 5
            const widthSegments = 10
            const heightSegments = 10
            const geo = new THREE.SphereBufferGeometry(radius, widthSegments, heightSegments)

            const points = new THREE.Points(geo, mat)
            scene.add(points)
            meshes.unshift(points)
        }

        {   //  points2
            const mat = new THREE.PointsMaterial({
                color:'mediumorchid',
                sizeAttenuation:false,  //the points will be the same size regardless of their distance from the camera
                size:1  //  in pixels
            })

            const radius = 3.5;
            const tube = 1.5;
            const radialSegments = 100;
            const tubularSegments = 150;
            const p = 2;
            const q = 3;
            const geo = new THREE.TorusKnotBufferGeometry(radius, tube, tubularSegments, radialSegments, p, q);

            const points = new THREE.Points(geo, mat)
            points.position.set(6, 6, 0)
            scene.add(points)
            meshes.unshift(points)
        }

    }

    {   //  light
        const color = 0xffffff
        const intensity = 3
        const light = new THREE.DirectionalLight(color, intensity)
        light.position.set(-100, 100, 100)
        scene.add(light)
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

            meshes.forEach((mesh, i) => {
                mesh.rotation.x = time*(i+1)
                mesh.rotation.y = time*(i+1)
            });


            renderer.render(scene, camera)

        }
        requestAnimationFrame(render)
    }
}

export default () => {
  const canvasRef = useRef()
  useEffect (() => {
    const canvas = canvasRef.current
    main(canvas)
  }, [])

  return (
      <canvas ref={canvasRef} className='canvas'/>
  );
}
