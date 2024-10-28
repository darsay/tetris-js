class Vector2D {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    magnitude() {
        return Math.sqrt(this.x**2 + this.y**2);
    }

    normalized() {
        const magnitude = this.magnitude();

        if(magnitude() === 0) {
            return {x: 0, y: 0};
        }

        return new Vector2D(this.x / magnitude, this.y / magnitude);
    }

    static add(vector1, vector2) {
        return new Vector2D(
            vector1.x + vector2.x,
            vector1.y + vector2.y
        );
    }
}