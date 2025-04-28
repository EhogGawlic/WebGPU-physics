export async function createShader(gl, type, source) {
    const file = await fetch(source)
    const filetext = await file.text()
    const shader = gl.createShader(type)
    gl.shaderSource(shader, filetext)
    gl.compileShader(shader)
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('An error occurred compiling the shaders in the '+type+': ' + gl.getShaderInfoLog(shader))
        gl.deleteShader(shader)
        return null
    }
    return shader
}
/**
 * 
 * @returns {Promise<{gl: WebGLRenderingContext, program: WebGLProgram}>}
 */
export async function init(){
    const canvas = document.querySelector('canvas')
    canvas.style.width="600px"
    canvas.style.height="400px"
    const gl = canvas.getContext('webgl')
    gl.canvas.width=600
    gl.canvas.height=400
    if (!gl) {
        console.error('Unable to initialize WebGL. Your browser may not support it.')
        return null
    }
    const vertexShader = await createShader(gl, gl.VERTEX_SHADER, 'src/shaders/vs.glsl')
    const fragmentShader = await createShader(gl, gl.FRAGMENT_SHADER, 'src/shaders/fs.glsl')
    const program = gl.createProgram()
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Unable to initialize the shader program: ' + gl.getProgramInfoLog(program))
        return null
    }
    return {gl, program}
}
/**
 * 
 * @param {WebGLRenderingContext} gl 
 * @param {WebGLProgram} prog 
 * @param {Object} obj 
 * @returns {Object}
 */
export function doBuffers(gl, prog, obj){
    const inds = []
    for (let i = 0; i < obj.vertices.length; i++) {
        inds.push(i)
    }
    const vbo = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(obj.full), gl.STATIC_DRAW)
    const ibo = gl.createBuffer()
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(inds), gl.STATIC_DRAW)
    return {vbo,ibo}
}