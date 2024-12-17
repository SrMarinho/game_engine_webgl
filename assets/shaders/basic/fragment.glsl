#version 300 es
precision mediump float;

struct camera {
    vec3 position;
};

in vec3 Normal;
in vec3 FragPos;
in vec3 vColor;
in camera cam;
in float time;

out vec4 fragColor;

vec3 lightPosition = vec3(-5.0, 5.0, -5.0); // Posição da luz
vec3 lightColor = vec3(1.0, 1.0, 1.0);    // Cor da luz (branca)
float lightIntensity = 1.0;               // Intensidade da luz

void main() {
    lightPosition = vec3(-5.0 * cos(time), 5.0, -5.0 * sin(time)); // Posição da luz

    vec3 lightDir = normalize(lightPosition - FragPos);

    vec3 norm = normalize(Normal);

    float ambientStrength = 0.1;
    vec3 ambient = ambientStrength * lightColor;

    float diff = max(dot(norm, lightDir), 0.0);
    vec3 diffuse = diff * lightColor * lightIntensity;

    float specularStrength = 1.0;
    vec3 viewDir = normalize(cam.position - FragPos);
    vec3 reflectDir = reflect(-lightDir, norm);  

    float spec = pow(max(dot(viewDir, reflectDir), 0.0), 64.0);
    vec3 specular = specularStrength * spec * lightColor;  

    vec3 result = (ambient + diffuse + specular) * vColor;

    fragColor = vec4(result, 1.0);
}
