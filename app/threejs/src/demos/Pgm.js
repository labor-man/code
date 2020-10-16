import React, { useEffect, useRef, useState } from 'react'
import * as pako from 'pako'

export default () => {
    const inputRef = useRef()
    const [res, setRes] = useState('')
    useEffect(_ => {
        console.log(inputRef.current)
    }, [])

    function encode(){
        const value = inputRef.current.value;
        setRes(btoa(pako.gzip(value, {to: "string"})))
    }
    function decode(){
        const value = inputRef.current.value;
        const decodedData = atob(value);

        const charData    = decodedData.split('').map(function(x){return x.charCodeAt(0);});
        console.log('charData:',charData)
        const binData     = new Uint8Array(charData);
        console.log('binData:',binData)
        const data        = pako.inflate(binData);
        console.log('data:',data)
        window.data = data
        const res     = String.fromCharCode.apply(null, new Uint16Array(data));
        console.log('res:',res)

        setRes(res)
    }
    return (
        <div>
        <input id="content" type="text" ref={inputRef}/>
        <button onClick={encode}>encode</button>
        <button onClick={decode}>decode</button>
        <div id="ciphertext">{res}</div>
        </div>
    )
}
