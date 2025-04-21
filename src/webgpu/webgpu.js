import * as utils from './init.js'
async function renderBalls() {
    const encoder = device.createCommandEncoder({})
    const pass = encoder.beginComputePass({
        label: 'doubling compute pass',
    })
    pass.setPipeline(pipeline)
    pass.setBindGroup(0, bgroup)
    pass.dispatchWorkgroups(input.length / 6) // Divide by 8 floats per ball
    pass.end()
    encoder.copyBufferToBuffer(wbuf, 0, rbuf, 0, rbuf.size)
    device.queue.submit([encoder.finish()])

    try {
        await rbuf.mapAsync(GPUMapMode.READ)
        result = new Float32Array(rbuf.getMappedRange())
        console.log('input', input)
        console.log('result', result)
        result = convertFloat32ToFloat64(result)
        rbuf.unmap()

        ctx.clearRect(0, 0, 600, 400)
        for (let i = 0; i < result.length; i += 6) {
            const x = result[i]       // x position
            const y = result[i + 1]   // y position
            const radius = result[i + 4] // radius (optional, if you want to use it)

            ctx.beginPath()
            ctx.arc(x, y, radius || 5, 0, Math.PI * 2) // Use radius if available, otherwise default to 5
            ctx.fillStyle = 'red'
            ctx.fill()
            ctx.stroke()
        }
    } catch (err) {
        console.error('Failed to map result buffer:', err)
    }

    requestAnimationFrame(renderBalls)
}

window.onload = () => {
    utils.init().then(async ({ devic, ct }) => {
        device = devic
        const shaders = await utils.readWGSLFiles()
        computeModule = utils.createShaderModule(device, shaders.compute, 'compute')
        pipeline = device.createComputePipeline({
            label: 'doubling compute pipeline',
            layout: 'auto',
            compute: {
                module: computeModule
            },
        })
        const bufferSize = input.byteLength // Total size of the input array in bytes
        wbuf = device.createBuffer({
            label: 'work buffer',
            size: bufferSize,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST,
        })
        rbuf = device.createBuffer({
            label: 'result buffer',
            size: bufferSize,
            usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST,
        })
        device.queue.writeBuffer(wbuf, 0, input)
        bgroup = device.createBindGroup({
            label: 'bindGroup for work buffer',
            layout: pipeline.getBindGroupLayout(0),
            entries: [
                { binding: 0, resource: { buffer: wbuf } },
            ],
        })
        console.log('Input byte length:', input.byteLength)
        console.log('Work buffer size:', wbuf.size)
        console.log('Result buffer size:', rbuf.size)
        ctx = ct
        renderBalls()
    })
}