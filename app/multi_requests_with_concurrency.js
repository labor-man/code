function fakeRequest(url){
    return new Promise(resolve => {
        const time = (Math.random() + 1) * 5000;
        setTimeout(() => {
            resolve(`result ${time}`)
        }, time)
    })
}

function multiRequest(urls, max){
    let resolve;
    const promise = new Promise(r => resolve = r)
    const promises = []
    let i = 0

    function task(){
        if(i < urls.length){
                const j = i;
                console.log(`${j} start ${new Date().toLocaleString()}`)
                promises.push(fakeRequest(urls[i++]).then(res => {
                    console.log(`${j} end ${new Date().toLocaleString()}`)
                    task()
                    return res
                }))  
        }else {
            resolve()
        }
    }
    
    while(i < max){
        task()
    }
    
    return promise.then(r => Promise.all(promises))
}
// multiRequest([1,2,3,4,5,6,7,8], 3).then(res => console.log(res))