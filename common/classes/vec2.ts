import { ASCII_ALPHABET_POSITION } from 'common/constants';

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

    copy(): Vec2 {
        return new Vec2(this.x, this.y);
    }
}

export const boardPositionToVec2 = (position: string): Vec2 => {
    return new Vec2(position.slice(0).charCodeAt(0) - ASCII_ALPHABET_POSITION, parseInt(position.substring(1), 10) - 1);
};
