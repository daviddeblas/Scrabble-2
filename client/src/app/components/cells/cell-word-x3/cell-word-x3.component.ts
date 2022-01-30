import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: '[app-cell-word-x3]',
    templateUrl: './cell-word-x3.component.html',
    styleUrls: ['./cell-word-x3.component.scss'],
})
export class CellWordX3Component implements OnInit {
    @Input() posX: number = 0;

    @Input() posY: number = 0;

    constructor() {}

    ngOnInit(): void {}
}
