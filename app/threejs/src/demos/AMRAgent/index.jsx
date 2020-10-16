import createAxesGridControlGUI from './createAxesGridControlGUI'
import createLight from './createLight'
import createCubeAndSphere from './createCubeAndSphere'
import createPerspectiveCamera from './createPerspectiveCamera'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import createMap from './createMap'
import createPointCloud from './createPointCloud'
import render from './render'
import {
    createRGBAData,
    createXYZCoordinates
} from './utils/format'

import * as THREE from 'three'
import * as dat from 'dat.gui'
import React, { useRef, useEffect, useState } from 'react'

function initCanvas(canvas){
    let objects = []

    const renderer = new THREE.WebGLRenderer({canvas})
    renderer.setClearColor(new THREE.Color(0xcccccc))

    const camera = createPerspectiveCamera(canvas.clientWidth/canvas.clientHeight)
    const scene = new THREE.Scene()
    const gui = new dat.GUI()

    const [cube, sphere] = createCubeAndSphere()
    scene.add(cube, sphere)

    const map = createMap()
    scene.add(map)

    const pointCloud = createPointCloud()
    scene.add(pointCloud)

    createLight(scene, gui)
    const axesGridHelperObject = createAxesGridControlGUI(scene, 100)
    gui.add(axesGridHelperObject, 'visible').name('scene grid')

    const controls = new OrbitControls(camera, canvas)
    controls.target.set(0, 5, 0)
    controls.update()

    render(renderer, scene, camera, objects)

    return [map, pointCloud]
}

export default () => {
    const canvasRef = useRef()
    const [map, setMap] = useState()
    const [pointCloud, setPointCloud] = useState()
    const [isInit, setIsInit] = useState(true)
    const [mapMesh, setMapMesh] = useState()
    const [pointCloudMesh, setPointCloudMesh] = useState()
    const [resolution, setResolution] = useState(0.05)

    function initWs(){
        const ws = new WebSocket("ws://10.0.20.187:2000/api/ws");

        ws.onopen = function(evt) {
          console.log("Connection open ...");
          ws.send('map_textures 1')
          ws.send('point_cloud 1')
        }

        ws.onmessage = function(evt){
            const data = JSON.parse(evt.data)

            if(data.type === 'map_textures'){
                setMap(data)
            }else if(data.type === 'point_cloud'){
                setPointCloud(data)
            }
        }

        ws.onclose = function(evt) {
          console.log("Connection closed.");
        };
        return ws
    }

    useEffect(_ => {
        const canvas = canvasRef.current
        const [mapMesh, pointCloudMesh] = initCanvas(canvas)
        setMapMesh(mapMesh)
        setPointCloudMesh(pointCloudMesh)
        const ws = initWs()

        console.log(mapMesh)
        console.log(pointCloudMesh)

        return ws.close
    }, [])

    useEffect(_ => {
        if(map){
            const data = map.data[0].data[0]
            const {cells, width, height, resolution} = data
            const RGBAData = createRGBAData(cells, width, height)
            const texture = new THREE.DataTexture(RGBAData, width, height, THREE.RGBAFormat)
            mapMesh.material.map = texture
            mapMesh.geometry.width = width
            mapMesh.geometry.height = height
        }
        if(pointCloud){
            // const data = map.data[0].data[0]
            // const XYZCoordinates = createXYZCoordinates(OriginStr, resolution)
            // pointCloudMesh.geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( XYZCoordinates, 3 ) );
        }
    })

    return (
        <div style={{width:'100%', height:'100%'}}>
            <canvas className='canvas' ref={canvasRef}/>
        </div>
    )
}
