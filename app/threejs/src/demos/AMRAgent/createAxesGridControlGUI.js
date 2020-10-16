import * as THREE from 'three'

class AxesGridHelper{
    constructor(node, units){
        this._visible = false

        const axesHelper = new THREE.AxesHelper()
        axesHelper.material.depthTest = false   // will not check to see if they are drawing behind something else
        axesHelper.renderOrder = 2    //  // drawn order(default is 0)
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

export default (node, units = 10) => {
    const axesGridHelperObject = new AxesGridHelper(node, units)
    return axesGridHelperObject
}
