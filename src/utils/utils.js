let input = new Float32Array([
    0,0,0,0,0,0,5,1
])
const partSize = 32
function getMassOfBall(rad){
    const density = document.getElementById("dinp").value
    return (4/3) * Math.PI * Math.pow(rad, 3) * density
}
let mass = 1,framessincelastball=0,balladdspeed=30,frameaddball=2
function convertFloat32ToFloat64(float32Array) {
    return [...float32Array]
}

let ctx,device,pipeline,bgroup,wbuf,rbuf, computeModule,result