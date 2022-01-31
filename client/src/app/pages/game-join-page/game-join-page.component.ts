import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-game-join-page',
    templateUrl: './game-join-page.component.html',
    styleUrls: ['./game-join-page.component.scss'],
})
export class GameJoinPageComponent implements OnInit {
    formGroup: FormGroup;

    constructor(formBuilder: FormBuilder) {
        this.formGroup = formBuilder.group({
            name: ['', Validators.required],
        });
    }

    ngOnInit(): void {}
}
