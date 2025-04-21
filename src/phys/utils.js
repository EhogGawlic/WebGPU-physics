export function addBall(x,y) {
    const newBall = new Float32Array([x, y, 0, 0, 5, 1]) // New ball: pos (x, y, z), vel (x, y, z), rad, mass
    const updatedInput = new Float32Array(result.length + newBall.length)
    updatedInput.set(result)
    updatedInput.set(newBall, result.length)
    input = updatedInput // Update the input array
    console.log('input', input)
    // Recreate buffers with the updated input
    const bufferSize = input.byteLength // Total size of the updated input array in bytes
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

    // Update the bind group
    bgroup = device.createBindGroup({
        label: 'bindGroup for work buffer',
        layout: pipeline.getBindGroupLayout(0),
        entries: [
            { binding: 0, resource: { buffer: wbuf } },
        ],
    })
}