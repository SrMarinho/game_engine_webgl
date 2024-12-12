#version 300 es
precision mediump float;

in vec3 aPosition;
// in vec3 aColor;

// out vec3 vColor;

uniform float uTime;
uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;

void main() {
    gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aPosition, 1.0);
    // vColor = aColor;
}
