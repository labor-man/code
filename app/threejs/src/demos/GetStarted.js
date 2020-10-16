import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import png from '../p.png'
import girl from '../girl.png'

const main  = canvas => {
    const renderer = new THREE.WebGLRenderer({canvas})
    renderer.setClearColor(new THREE.Color('white'))
    //  camera
    const fov = 75
    const aspect = 2
    const near = 0.1
    const far = 20
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
    camera.position.z = 10

    //  scene
    const scene = new THREE.Scene()
    window.scene = scene


    //  mat
    function createMat(color){
        return new THREE.MeshPhongMaterial({color})
    }
    //  geo
    const boxWidth = 1
    const boxHeight = 1
    const boxDepth = 1
    const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth)

    let cubes = []
    {   //  meshes
        const cube1 = new THREE.Mesh(geometry, createMat(0x44aa88))
        cube1.position.x = 2
        const cube2 = new THREE.Mesh(geometry, createMat(0x8844aa))
        cube2.position.x = 0
        const cube3 = new THREE.Mesh(geometry, createMat(0xaa8844))
        cube3.position.x = -2

        cubes = [cube1, cube2, cube3]

        scene.add(...cubes)
    }

    {  // plane1
        const width = 3
        const height = 3
        const rgbData = new Uint8Array( 3*width*height )
        for(let i=0; i<width*height; i++){
          if(i<(width*height/2)){
            rgbData[3*i] = 0
            rgbData[3*i+1] = 0
            rgbData[3*i+2] = 0
          }
          else{
            rgbData[3*i] = 0
            rgbData[3*i+1] = 255
            rgbData[3*i+2] = 0 
          }
        }

        const rgbaData1 = new Uint8Array(16)
        for(let i=0; i<4; i++){
            if(i<2){
              rgbaData1[4*i] = 255
              rgbaData1[4*i+1] = 0
              rgbaData1[4*i+2] = 0
              rgbaData1[4*i+3] = 255
            }
            else{
              rgbaData1[4*i] = 0
              rgbaData1[4*i+1] = 0
              rgbaData1[4*i+2] = 0
              rgbaData1[4*i+3] = 129
            }

        }

        const alphaData = new Uint8Array( 3*width*height )
        for(let i=0; i<width*height; i++){
          if(i>(width*height/2)){
            alphaData[3*i] = 255
            alphaData[3*i+1] = 255
            alphaData[3*i+2] = 255
          }
          else{
            alphaData[3*i] = 0
            alphaData[3*i+1] = 0
            alphaData[3*i+2] = 0
          }
        }

        const texture = new THREE.DataTexture(rgbData, width, height, THREE.RGBFormat);
        const texture1 = new THREE.DataTexture(rgbaData1, 2, 2, THREE.RGBAFormat);  
        const alphaTexture = new THREE.DataTexture(alphaData, 2, 2, THREE.RGBFormat); 
        window.t1 = texture
        window.t2 = texture1
        window.t3 = alphaTexture
        console.log('my-texture:', texture1)   
        const mat = new THREE.MeshBasicMaterial({map:texture1})
        // mat.map.minFilter = THREE.LinearFilter;
        // mat.map.generateMipmaps = false;
        // mat.map.needsUpdate = true;
        // mat.alphaTest = 0.5
        // mat.deepTest = false
        // renderer.copyTextureToTexture(new THREE.Vector2(0,0), texture1,mat.map,0)
        const geo = new THREE.PlaneBufferGeometry(2, 2)
        const mesh = new THREE.Mesh(geo, mat)
        mesh.renderOrder=1
        mesh.material.depthTest=false
        mesh.material.side = THREE.DoubleSide
        mesh.material.transparent = true
        scene.add(mesh)

        const clone = mesh.clone()
        clone.position.set(1,-1,0)
        clone.renderOrder = 2
        scene.add(clone)
    }

    {  // plane1
        const loader1 = new THREE.TextureLoader();
        const loader2 = new THREE.TextureLoader();
        loader1.load(png, (texture1) => {
          window.t4 = texture1
          loader2.load(girl, texture2 => {
            window.t5 = texture2
            console.log('img-texture:', texture2)
            window.imgTexture = texture2
            const mat = new THREE.MeshBasicMaterial({
              map: texture1,
              // aoMapIntensity:0,
              transparent:true,
              opacity:1,
              side:THREE.DoubleSide
            });
            mat.map.minFilter = THREE.LinearFilter;
            mat.map.generateMipmaps = false;
            mat.map.needsUpdate = true;
            // renderer.copyTextureToTexture(new THREE.Vector2(600, 600), texture2,mat.map)
            const geo = new THREE.PlaneBufferGeometry(5, 5)
            const mesh = new THREE.Mesh(geo, mat)
            mesh.renderOrder = 0
            mesh.position.set(4,4,0)
            scene.add(mesh)

            const clone = mesh.clone()
            clone.position.set(-4,4,0)
            scene.add(clone)
          })

        });

    }

    {  // plane2
        const loader = new THREE.TextureLoader();
        loader.load(girl, (texture1) => {
          window.t6 = texture1
            
          const mat = new THREE.MeshBasicMaterial({
            map: texture1,
            transparent:true,
            opacity:1,
            side:THREE.DoubleSide
          });
          mat.depthTest = false
          // mat.map.minFilter = THREE.LinearFilter;
          // mat.map.generateMipmaps = false;
          // mat.map.needsUpdate = true;
          const geo = new THREE.PlaneBufferGeometry(5, 5)
          const mesh = new THREE.Mesh(geo, mat)
          window.geo = geo
          window.mesh = mesh
          mesh.renderOrder = 100
          mesh.position.set(4,4,0)

          scene.add(mesh)

          const clone = mesh.clone()
          clone.position.set(0,4,0)
          clone.renderOrder = 99
          scene.add(clone)


        });

    }
    {  // plane3
        const loader1 = new THREE.TextureLoader();
        const loader2 = new THREE.TextureLoader();
        loader1.load(png, (texture1) => {
            window.t4 = texture1
            loader2.load(girl, texture2 => {
              texture2.offset.set(0.5, 0.5)
              texture2.transformUv(new THREE.Vector2(0.5,0.5))
              texture2.updateMatrix()
              const vertShader = `
                varying vec2 vUv;

                void main()
                {
                    vUv = uv;
                    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
                    gl_Position = projectionMatrix * mvPosition;
                }
              `

              const fragShader = `
                #ifdef GL_ES
                precision highp float;
                #endif

                uniform sampler2D tOne;
                uniform sampler2D tSec;

                varying vec2 vUv;

                void main(void)
                {
                    vec3 c;
                    vec4 Ca = texture2D(tOne, vUv);
                    vec4 Cb = texture2D(tSec, vUv);
                    c = Ca.rgb + Cb.rgb;  // blending equation
                    gl_FragColor= vec4(c, 1.0);
                }
              `

              //c = Ca.rgb * Ca.a + Cb.rgb * Cb.a * (1.0 - Ca.a);  // blending equation

              var attributes = {}; // custom attributes

              var uniforms = {    // custom uniforms (your textures)

                tOne: { type: "t", value: texture1 },
                tSec: { type: "t", value: texture2 }

              };

              var mat = new THREE.ShaderMaterial({

                uniforms: uniforms,
                attributes: attributes,
                vertexShader: vertShader,
                fragmentShader: fragShader

              });
              
              const geo = new THREE.PlaneBufferGeometry(5, 5)
              const mesh = new THREE.Mesh(geo, mat)
              window.mesh1 = mesh
              mesh.renderOrder = 0
              mesh.position.set(4,8,0)
              scene.add(mesh)
          })
        });
      }




    {   //  light
        const color = 0xffffff
        const intensity = 1
        const light = new THREE.DirectionalLight(color, intensity)
        light.position.set(-1, 2, 4)
        scene.add(light)
    }

    const controls = new OrbitControls(camera, canvas)
    controls.target.set(0, 5, 0)
    controls.update()   //  controls will use the new target.

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

        cubes.forEach((cube, i) => {
            cube.rotation.x = time*(i+1)
            cube.rotation.y = time*(i+1)
            cube.rotation.y = time*(i+1)
        });


        renderer.render(scene, camera)

    }
    requestAnimationFrame(render)

    console.log('info:', renderer.info)
    window.renderer = renderer

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
