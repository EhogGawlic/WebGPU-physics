let input = new Float32Array([
    0,0,0,0,5,1
])
const partSize = 32
function convertFloat32ToFloat64(float32Array) {
    return [...float32Array]
}

let ctx,device,pipeline,bgroup,wbuf,rbuf, computeModule,result