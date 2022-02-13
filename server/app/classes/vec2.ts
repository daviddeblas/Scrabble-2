export class Vec2 {
    constructor(public x: number, public y: number) {}

    equals(b: Vec2): boolean {
        return this.x === b.x && this.y === b.y;
    }

    add(b: Vec2): Vec2 {
        return new Vec2(this.x + b.x, this.y + b.y);
    }

    sub(b: Vec2): Vec2 {
        return new Vec2(this.x - b.x, this.y - b.y);
    }

    copy(): Vec2 {
        return new Vec2(this.x, this.y);
    }
}
