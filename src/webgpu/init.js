export async function init(){
    if (!navigator.gpu) {
        console.error("WebGPU not supported. Please use a compatible browser.")
        return null
    }
    const adapter = await navigator.gpu.requestAdapter()
    if (!adapter) {
        console.error("No GPU adapter found.")
        return null
    }
    const devic = await adapter.requestDevice()
    const canvas = document.querySelector('canvas')
    const ct = canvas.getContext('2d')
    ct.canvas.width = canvas.clientWidth
    ct.canvas.height = canvas.clientHeight
    return {devic, ct}
}
export async function readWGSLFiles(){
    return new Promise(async(resolve, reject) => {
        const response = await fetch('/src/shaders/compute.wgsl')
        const responsev = await fetch('/src/shaders/vs.wgsl')
        const responsef = await fetch('/src/shaders/fs.wgsl')
        if (!response.ok) {
            throw new Error(`Failed to fetch WGSL file: ${response.statusText}`)
            reject(`Failed to fetch WGSL file: ${response.statusText}`)
        }
        if (!responsev.ok) {
            throw new Error(`Failed to fetch WGSL file: ${response.statusText}`)
            reject(`Failed to fetch WGSL file: ${responsev.statusText}`)
        }
        if (!responsef.ok) {
            throw new Error(`Failed to fetch WGSL file: ${response.statusText}`)
            reject(`Failed to fetch WGSL file: ${responsef.statusText}`)
        }
        const wgslCode = await response.text()
        const wgslCodev = await responsev.text()
        const wgslCodef = await responsef.text()
        resolve({compute: wgslCode, vertex: wgslCodev, fragment: wgslCodef})
    })
}
export function createShaderModule(device, code,label){
    return device.createShaderModule({label,code})
}