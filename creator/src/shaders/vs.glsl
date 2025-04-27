precision mediump float;
uniform mat4 uProjectionMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uModelMatrix;
attribute vec3 pos;
attribute vec3 norm;
attribute vec3 col;
varying vec4 vColor;
void main(){
    vColor = vec4(col,1.0);
    gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(pos, 1.0);
}