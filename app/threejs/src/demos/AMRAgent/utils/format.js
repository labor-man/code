import * as pako from 'pako'

function createRGBAData(originStr, width, height, maxValue = 127){
    const decodedData = atob(originStr);
    const charData    = decodedData.split('').map(function(x){return x.charCodeAt(0);});
    const binData     = new Uint8Array(charData);
    const originData        = pako.inflate(binData);
    const GrayscaleData = originData.filter((_, i) => i%2===0).map(x => x/maxValue*255)
    const rgbaData = new Uint8Array(width*height*4)
    for(let i=0; i<width*height; i++){
        const index = 4*i
        rgbaData[index] = originData[2*i]
        rgbaData[index + 1] = originData[2*i]
        rgbaData[index + 2] = originData[2*i]
        rgbaData[index + 3] = originData[2*i+1]
    }

    return rgbaData
}

function createXYZCoordinates(originStr, resolution = 0.05){
    const decodedPointsString = atob(originStr);
    const charPointsArray = decodedPointsString.split('').map(function(x){return x.charCodeAt(0);});
    const uint8Array = new Uint8Array(charPointsArray)
    const float32Array = new Float32Array(uint8Array.buffer)
    const filteredFloat32Array = float32Array.filter((v, i) => (i+1)%4!=0).map(v => 1/resolution*v)

    return filteredFloat32Array
}

export {
    createRGBAData,
    createXYZCoordinates
}
