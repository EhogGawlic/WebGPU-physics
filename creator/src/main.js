import * as utils from './utils.js';
import * as glu from './gl.js';
import * as mat4 from './toji-gl-matrix-1f872b8/src/mat4.js'
console.log("work pls")
glu.init().then(async ({ gl, program }) => {
    gl.clearColor(0.5,0.5,0.5,1)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    
    // Enable depth testing
    gl.enable(gl.DEPTH_TEST);
    const obj = await utils.fileToObj('src/objects/cyube.obj')
    const {vbo, ibo } = glu.doBuffers(gl, program, obj)
    const poss = {
        vpos: gl.getAttribLocation(program, 'pos'),
        norm: gl.getAttribLocation(program, 'norm'),
        col: gl.getAttribLocation(program, 'col'),
        pmat: gl.getUniformLocation(program, 'uProjectionMatrix'),
        vmat: gl.getUniformLocation(program, 'uViewMatrix')
    }
    gl.vertexAttribPointer(
        poss.vpos, 3, gl.FLOAT, false, 9*Float32Array.BYTES_PER_ELEMENT, 0
    )
    gl.vertexAttribPointer(
        poss.norm, 3, gl.FLOAT, false, 9*Float32Array.BYTES_PER_ELEMENT, 3*Float32Array.BYTES_PER_ELEMENT
    )
    gl.vertexAttribPointer(
        poss.col, 3, gl.FLOAT, false, 9*Float32Array.BYTES_PER_ELEMENT, 6*Float32Array.BYTES_PER_ELEMENT
    )
    gl.enableVertexAttribArray(poss.vpos)
    gl.enableVertexAttribArray(poss.norm)
    gl.enableVertexAttribArray(poss.col)
    gl.useProgram(program)
    const pmat = new Float32Array(16)
    const vmat = new Float32Array(16)
    mat4.perspective(pmat,45*(Math.PI/180), 600/400,0.1,1000)
    mat4.lookAt(vmat, [0,3,-5],[0,-2,0],[0,1,0])
    gl.uniformMatrix4fv(poss.pmat, false, pmat)
    gl.uniformMatrix4fv(poss.vmat, false, vmat)
    gl.drawElements(gl.TRIANGLES, obj.inds.length, gl.UNSIGNED_SHORT, 0)
    console.log(obj.inds)
    console.log(obj.vertices)
    console.log(obj.full)
    console.log('vpos:', poss.vpos, 'norm:', poss.norm, 'col:', poss.col);
console.log('pmat:', poss.pmat, 'vmat:', poss.vmat);
})