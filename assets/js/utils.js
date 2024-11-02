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

function isAlphaNumeric(code) {
    return (isNumeric(code) ||
            isAlpha(code));
}

function isAlpha(code) {
    return ((code > 64 && code < 91) || // upper alpha (A-Z)
            (code > 96 && code < 123));
}

function isNumeric(code) {
    return (code > 47 && code < 58); // numeric (0-9)
}