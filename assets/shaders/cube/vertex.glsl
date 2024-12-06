#version 300 es
precision mediump float;

in vec3 aPosition;
in vec3 aColor;

out vec3 vColor;

uniform float uTime;
uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;

mat4 orthogonal(float left, float right, float bottom, float top, float znear, float zfar) {
    float xscale = 2.0 / (right - left);
    float yscale = 2.0 / (top - bottom);
    float zscale = -2.0 / (zfar - znear);
    float xoffset = -(right + left) / (right - left);
    float yoffset = -(top + bottom) / (top - bottom);
    float zoffset = -(zfar + znear) / (zfar - znear);

    return mat4(
        xscale, 0.0,   0.0,   0.0,
        0.0,   yscale, 0.0,   0.0,
        0.0,   0.0,   zscale, 0.0,
        xoffset, yoffset, zoffset, 1.0
    );
}

mat4 perspective(float fovy, float ratio, float znear, float zfar) {
    float ymul = 1.0 / tan(fovy * 3.14159265 / 360.0); // Fator de escala vertical
    float xmul = ymul / ratio;                         // Fator de escala horizontal
    float zmul = (-2.0 * znear * zfar) / (zfar - znear); // Ajuste de profundidade

    return mat4(
        xmul, 0.0, 0.0, 0.0,
        0.0, ymul, 0.0, 0.0,
        0.0, 0.0, -(zfar + znear) / (zfar - znear), -1.0,
        0.0, 0.0, zmul, 0.0
    );
}


mat4 lookat(vec3 eye, vec3 center, vec3 up) {
    vec3 forward = normalize(center - eye);
    vec3 side = normalize(cross(forward, up));
    vec3 upward = cross(side, forward);
    return mat4(
        side.x, upward.x, -forward.x, 0.0,
        side.y, upward.y, -forward.y, 0.0,
        side.z, upward.z, -forward.z, 0.0,
        -dot(eye, side), -dot(eye, upward), dot(eye, forward), 1.0
    );
}


void main() {
    // float d = 4.0;
    // vec3 eye = vec3(d, d,d);
    // // vec3 eye = vec3(1, 1, 1);
    // vec3 center = vec3(0.0, 0.0, 0.0);
    // vec3 up = vec3(0.0, 1.0, 0.0);

    // mat4 viewMatrix = lookat(eye, center, up);

    // float left = -5.0;
    // float right = 5.0;
    // float bottom = -5.0;
    // float top = 5.0;
    // float znear = 0.1;
    // float zfar = 100.0;

    // mat4 orthoMatrix = orthogonal(left, right, bottom, top, znear, zfar);

    // float fovy = 90.0;     // Campo de visão vertical
    // float ratio = 1.0; // Proporção da tela

    // mat4 projectionMatrix = perspective(fovy, ratio, znear, zfar);


    gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aPosition, 1.0);
    // gl_Position = orthoMatrix * viewMatrix * uModelMatrix * vec4(aPosition, 1.0);
    vColor = aColor;
}
