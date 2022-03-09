import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { createRoom } from '@app/actions/room.actions';
import { MultiConfigWindowComponent } from '@app/components/multi-config-window/multi-config-window.component';
import { Store } from '@ngrx/store';
import { GameOptions } from 'common/classes/game-options';

@Component({
    selector: 'app-game-preparation-page',
    templateUrl: './game-preparation-page.component.html',
    styleUrls: ['./game-preparation-page.component.scss'],
})
export class GamePreparationPageComponent implements OnInit {
    @ViewChild('MultiConfigWindowComponent') multiConfigWindowComponent: MultiConfigWindowComponent;
    @ViewChild('stepper') stepper: MatStepper;
    firstFormGroup: FormGroup;
    isEditable = false;
    constructor(private formBuilder: FormBuilder, private store: Store) {}

    ngOnInit(): void {
        this.firstFormGroup = this.formBuilder.group({
            firstCtrl: ['', Validators.required],
        });
    }

    onGameOptionsSubmit(gameOptions: GameOptions): void {
        this.store.dispatch(createRoom({ gameOptions }));
        this.stepper.next();
    }

    get formSettings(): FormGroup {
        return this.multiConfigWindowComponent ? this.multiConfigWindowComponent.settingsForm : this.firstFormGroup;
    }
}
