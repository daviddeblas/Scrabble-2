import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: '[app-cell-letter-x3]',
    templateUrl: './cell-letter-x3.component.html',
    styleUrls: ['./cell-letter-x3.component.scss'],
})
export class CellLetterX3Component implements OnInit {
    @Input() posX: number = 0;

    @Input() posY: number = 0;

    constructor() {}

    ngOnInit(): void {}
}
