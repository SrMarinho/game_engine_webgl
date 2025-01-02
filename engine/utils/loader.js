export class Loader {
    static async loadShader(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Falha ao carregar o shader: ${url}`);
            }
            return await response.text(); // Retorna o conteúdo do arquivo GLSL
        } catch (error) {
            console.error(`Erro ao carregar o shader de ${url}:`, error);
            throw error;
        }
    }

    static async loadTexture(url) {
        try {
            const image = new Image();
            image.src = url;

            return new Promise((resolve, reject) => {
                image.onload = () => resolve(image);
                image.onerror = (error) => reject(`Falha ao carregar a textura de ${url}: ${error}`);
            });
        } catch (error) {
            console.error(`Erro ao carregar a textura de ${url}:`, error);
            throw error;
        }
    }

    static async loadModel(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Falha ao carregar o modelo: ${url}`);
            }
            return await response.text(); // Retorna o conteúdo do arquivo de modelo
        } catch (error) {
            console.error(`Erro ao carregar o modelo de ${url}:`, error);
            throw error;
        }
    }
}
