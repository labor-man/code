import * as THREE from 'three'
import ColorGUIHelper from './ColorGUIHelper'

function createXYZGUI(gui, vector3, name, onChangeFn){
    gui.add(vector3, 'x', -10, 10).name(`${name}-X`).onChange(onChangeFn)
    gui.add(vector3, 'y', 0, 10).name(`${name}-Y`).onChange(onChangeFn)
    gui.add(vector3, `z`, -10, 10).name(`${name}-Z`).onChange(onChangeFn)
}

function updateHelper(directionalLight){
    directionalLight.target.updateMatrixWorld();
}

export default (gui, directionalLight, folderName) => {
    const directionalLightFolder = gui.addFolder(folderName)
    directionalLightFolder.addColor(new ColorGUIHelper(directionalLight, 'color'), 'value').name('color')
    directionalLightFolder.add(directionalLight, 'intensity', 0, 2, 0.1)

    createXYZGUI(directionalLightFolder, directionalLight.position, 'source', () => updateHelper(directionalLight))
    createXYZGUI(directionalLightFolder, directionalLight.target.position, 'target', updateHelper(directionalLight))
}
