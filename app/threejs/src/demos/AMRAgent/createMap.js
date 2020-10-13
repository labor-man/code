import * as THREE from 'three'
import * as pako from 'pako'

export default () => {
    const mapValue = "H4sIAAAAAAAE/+2cz2sUMRTHX5XSiywFD70UEUSqpQhFpLKo4KE9iJeyUkqllFUopVh6UDwIy/zrfl9mZieZJNP9MTP5McnS3fyYbpJP3kte3mSHKAUrgRtrSSoQBC6IMnqSYNgJXNJ9YmTHg5KfIJQYNSG6FYQEo8um64ZbdlcQAqN/mJFS0AhUhIQcnWgXDDxji2RCYDSjPwNHUuv+yxohIUdJ1yRKnzRCYLSR5qMK0el8nuY1v3olRiWjC4lKxYdjiVHOyE4oMXqYUGLEjHhX1vRKupbvyhKjXKNM7+WuLDEy0eE81aK2cRqyri1GaMhz9qKEBKNBeiIXJ8SMHtmUNeL8ZQgdDdDOft5oC+nz9nRwjD4tSYiZDWtdm6xAaDCMMshCVu1boT9XlOl6Zc6JW472WE9sr5mZiJ4bM6NHimbRxrGS1lnYcmJmZOvzsvnxMlrGBmqmFiuj9gjFuheZrjjzmOUJchTdfs12f8NM4OHc+BitunrZWcU2H71tVctybnExetoBodj2InZ9WackpvloHQ5N/xuPrjX1cr2yWBi1aTPWiYLRTvhO2S4JxWFnt2tV16VIMHoTthx96WS9l0lB14I+yXbYOSEhRwEzUr1o8ti3GQ9bjtokYf8unKwNVo7svWq3hL6FyqhdDk3fthvoHbZuLSKV2CRIRn0SYl7h6VrfhMJj1LVVrepZngpLjvZ7sBl1SmEx0tvfR05IjPrgYaojHEam1veTFwqjfmiYawGjALwj/a/3Mi3/5UhurZu4z4y+Olnp9XEAIy892v1oF9dyjslmExA+0IXl1xFg5N2piH746PJS5fi916/a6SZGPyA1p/76+N1QUWulv77O0O2fiFF7vkzKR0buZx+VoG+MfOPDtMDIm5VeHT1/UmDkxX0Qf4joLXHP6LMntrPOpsyBKelQjrycffaF3GTHhWcfv3l0ZlX7yIclB0S8eJZYKcXy5yK/rJev7yYuZMi5UW3q2xOnc9KEjqi8uwJGL1wiGhtJ3JBbCRKSU/ymbQRN4zEcO8Gkzz60z63ZLLi548Q7+kq2r6VxPOiRVMmH20LZayHXYvS26DF/lnJetdRVDK3Z4Lr3JFJbnZOSe0snnOLnK+KdUPcuM9uW2iNf7To+ho+tbMOHzjiVNeSf4tkBGY2m0C8RhIXf/skzlsy8RozGL/HEy3lO1SIhx9yCQnKqEo4VpTMay6vJu1ZJ2U8l4lyKFM7mI6W2cZ0U+oczVPdYq4qeQrvpVRlXPmc0uuOrxlfQf1XjKct/1w5LEuEZ2onvgx5OW9nelrNPvZ+idRKfRZ+kU/+eh9K0i5rYLzbCHxIsFUY34jaf2UPpbdGo75RhXTun9/A68mm+6lVcgFtq2fpPYjXx4TnZZHI81NfVyymDQ170kOcRPBKc4x+V4ZknzvLSeZqKnQj+Ywd+/ZY9+/U+8WmviaWSF2vo2GSuFUKbpujNTIzuTBn9glLReabkONT55GnbE3BM0lZ+A+aO30WPK1lfJnYNA7Dl0V8X7oFFImCZ2YKq6/b+7/h8N8LWuXq+TR6wVjQF9jSc+jbWTQ1etczGB+tECiBQzh36Z8IjCIidhE4nyU8hH2xbnaj2aE7LtoINUK6KfZAqRYmPIgkao+79Bkr9ISQURl44xv2jhr0F7xH5lYJOgO0hcceJd8opaARke1ErTBk4D4jnAsKnmvTLLAy3NCHsw4VPPq3wOiPZi5r46HyQI7yYrF+HxuKUCQLCEiodvYmIkQB7v1NoJPAfDvt4pFh0AAA="

    const decodedData = atob(mapValue);

    const charData    = decodedData.split('').map(function(x){return x.charCodeAt(0);});
    const binData     = new Uint8Array(charData);
    window.uint8 = binData
    const originData        = pako.inflate(binData);

    const GrayscaleData = originData.filter((_, i) => i%2===0).map(x => x/127*255)

    const rgbaData = new Uint8Array(146*102*4)
    for(let i=0; i<146*102; i++){
        const index = 4*i
        rgbaData[index] = originData[2*i]
        rgbaData[index + 1] = originData[2*i]
        rgbaData[index + 2] = originData[2*i]
        rgbaData[index + 3] = originData[2*i+1]
    }

    const texture = new THREE.DataTexture(rgbaData, 146, 102, THREE.RGBAFormat)
    // const geo = new THREE.PlaneBufferGeometry(146, 102)
    // const mat = new THREE.MeshPhongMaterial({map:texture})
    // const map = new THREE.Mesh(geo, mat)
    // map.rotation.x = Math.PI*-.5
    // return map
    const geo = new THREE.PlaneBufferGeometry(100, 100)
    const mat = new THREE.MeshPhongMaterial({map:texture})
    const map = new THREE.Mesh(geo, mat)
    map.rotation.x = Math.PI*-.5
    return map
}
