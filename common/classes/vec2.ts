import { ASCII_ALPHABET_POSITION, DECIMAL_BASE } from 'common/constants';

export interface iVec2 {
    x: number;
    y: number;
}

export class Vec2 implements iVec2 {
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

    mul(n: number): Vec2 {
        return new Vec2(this.x * n, this.y * n);
    }

    flip() {
        return new Vec2(this.y, this.x);
    }

    copy(): Vec2 {
        return new Vec2(this.x, this.y);
    }
}

export const boardPositionToVec2 = (position: string): Vec2 => {
    return new Vec2(parseInt(position.substring(1), DECIMAL_BASE) - 1, position.slice(0).charCodeAt(0) - ASCII_ALPHABET_POSITION);
};

export const vec2ToBoardPosition = (v: Vec2): string => {
    return String.fromCharCode(v.x + ASCII_ALPHABET_POSITION) + (v.y + 1).toString();
};
