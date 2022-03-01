import { Vec2 } from './vec2';

export enum Orientation {
    Horizontal = 'horizontal',
    Vertical = 'vertical',
}

export class BoardSelection {
    constructor(public cell: Vec2 | null = null, public orientation: Orientation | null = null, public modifiedCells: Vec2[] = []) {}

    copy(): BoardSelection {
        const cell = this.cell ? { x: this.cell.x, y: this.cell.y } : null;
        return new BoardSelection(cell, this.orientation, [...this.modifiedCells]);
    }
}
