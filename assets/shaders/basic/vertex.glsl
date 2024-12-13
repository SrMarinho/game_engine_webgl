#version 300 es
precision mediump float;

struct camera {
    vec3 position;
};

in vec3 aPosition;
in vec3 aNormal;
in vec3 aColor;

out vec3 Normal; // Normais planas
out vec3 FragPos;
out vec3 vColor;
out vec3 cameraPosition;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform camera uCamera;

void main() {
    gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aPosition, 1.0);
    FragPos = vec3(uModelMatrix * vec4(aPosition, 1.0));
    Normal = mat3(transpose(inverse(uModelMatrix))) * aNormal; // Normais corrigidas
    vColor = aColor;
    cameraPosition = uCamera.position;
}
