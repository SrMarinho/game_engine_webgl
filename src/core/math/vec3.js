class Vec3 {
    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    add(vec) {
        this.x += vec.x;
        this.y += vec.y;
        this.z += vec.z;
    }

    subtract(vec) {
        this.x -= vec.x;
        this.y -= vec.y;
        this.z -= vec.z;
    }

    multiply(scalar) {
        this.x *= scalar;
        this.y *= scalar;
        this.z *= scalar;
    }

    divide(scalar) {
        if (scalar !== 0) {
            this.x /= scalar;
            this.y /= scalar;
            this.z /= scalar;
        }
    }

    normalize() {
        const length = this.magnitude();
        if (length !== 0) {
            this.divide(length);
        }
    }

    cross(vec) {
        const x = this.y * vec.z - this.z * vec.y;
        const y = this.z * vec.x - this.x * vec.z;
        const z = this.x * vec.y - this.y * vec.x;
        return new Vec3(x, y, z);
    }

    dot(vec) {
        return this.x * vec.x + this.y * vec.y + this.z * vec.z;
    }

    magnitude() {
        return Math.sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2);
    }

    clone() {
        return new Vec3(this.x, this.y, this.z);
    }
}

export default Vec3