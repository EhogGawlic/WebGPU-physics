precision mediump float;
uniform mat4 uProjectionMatrix;
uniform mat4 uViewMatrix;
attribute vec3 pos;
attribute vec3 norm;
attribute vec3 col;
varying vec4 vColor;
varying vec3 vNorm;
void main(){
    vNorm = norm;
    vColor = vec4(col,1.0);
    gl_Position = uProjectionMatrix * uViewMatrix * vec4(pos, 1.0);//*vec4(100.0, 100.0, 100.0, 1.0);
}