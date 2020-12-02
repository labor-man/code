// mySetInterval(fn, a, b),每次间隔 a,a+b,a+2b,...,a+Nb，myClearInterval
mySetInterval = (fn,a,b) => {
    let running = true;
    let count = 0;

    function loop(){
        setTimeout(() => {
            if(running === true){
                fn();
                count++;
                loop();
            } 
        }, a + count*b)
    }
    loop();
    return () => {
        running = false
    };
}

myClearInterval = (shutdown) => {
    shutdown();
}

res = mySetInterval(() => {
    const now =  new Date(Date.now())
    console.log(`${now.getMinutes()}:${now.getSeconds()}` )}, 1000, 2000)