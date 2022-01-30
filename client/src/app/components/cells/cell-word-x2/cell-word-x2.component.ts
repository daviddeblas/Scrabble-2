import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: '[app-cell-word-x2]',
    templateUrl: './cell-word-x2.component.html',
    styleUrls: ['./cell-word-x2.component.scss'],
})
export class CellWordX2Component implements OnInit {
    @Input() posX: number = 0;

    @Input() posY: number = 0;

    constructor() {}

    ngOnInit(): void {}
}
