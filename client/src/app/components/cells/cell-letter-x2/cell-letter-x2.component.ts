import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: '[app-cell-letter-x2]',
    templateUrl: './cell-letter-x2.component.html',
    styleUrls: ['./cell-letter-x2.component.scss'],
})
export class CellLetterX2Component implements OnInit {
    @Input() posX: number = 0;

    @Input() posY: number = 0;

    constructor() {}

    ngOnInit(): void {}
}
