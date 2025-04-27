import * as utils from './utils.js';
import * as glu from './gl.js';
import * as mat4 from '/toji-gl-matrix-1f872b8/src/mat4.js'
console.log("work pls")
glu.init().then(async ({ gl, program }) => {
    const obj = await utils.fileToObj('src/objects/coob.stl')
    const {vbo, ibo } = glu.doBuffers(gl, program, obj)
    const poss = {
        vpos: gl.getAttribLocation(program, 'pos'),
        norm: gl.getAttribLocation(program, 'norm'),
        col: gl.getAttribLocation(program, 'col'),
        pmat: gl.getUniformLocation(program, 'pmat'),
        vmat: gl.getUniformLocation(program, 'vmat')
    }
    gl.vertexAttribPointer(
        poss.vpos, 3, gl.FLOAT, false, 0, 0
    )
    gl.vertexAttribPointer(
        poss.norm, 3, gl.FLOAT, true, 0, 0
    )
    gl.vertexAttribPointer(
        poss.col, 3, gl.FLOAT, false, 0, 0
    )
})