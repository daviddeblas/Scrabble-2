import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: '[app-cell-star]',
    templateUrl: './cell-star.component.html',
    styleUrls: ['./cell-star.component.scss'],
})
export class CellStarComponent implements OnInit {
    @Input() posX: number = 0;

    @Input() posY: number = 0;

    constructor() {}

    ngOnInit(): void {}
}
