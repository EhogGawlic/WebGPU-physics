precision mediump float;
varying vec4 vColor;
varying vec3 vNorm;

void main(){
    vec3 lightDir = normalize(vec3(0.0, 1.0, 1.0));
    vec3 normal = normalize(vNorm);
    float diff = max(dot(normal, lightDir), 0.0);
    vec3 diffuse = diff * vec3(1.0, 1.0, 1.0); // White light
    vec3 ambient = vec3(0.1, 0.1, 0.1); // Low ambient light
    gl_FragColor = vec4(diffuse + ambient, 1.0) * vColor;
}