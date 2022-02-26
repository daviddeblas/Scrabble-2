import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { loadDictionaries } from '@app/actions/dictionaries.actions';
import { resetAllState } from '@app/actions/game-status.actions';
import { createRoom } from '@app/actions/room.actions';
import { GameOptions } from '@app/classes/game-options';
import { MAX_NAME_LENGTH, MIN_NAME_LENGTH, SECONDS_IN_MINUTE } from '@app/constants';
import { RoomService } from '@app/services/room.service';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

export const MAX_TIME = 300;
export const MIN_TIME = 30;
export const DEFAULT_TIMER = 60;
export const TIMER_INCREMENT = 30;

@Component({
    selector: 'app-multi-config-window',
    templateUrl: './multi-config-window.component.html',
    styleUrls: ['./multi-config-window.component.scss'],
})
export class MultiConfigWindowComponent implements OnInit {
    settingsForm: FormGroup;
    dictionaries$: Observable<string[]>;
    timer: number;
    readonly minNameLength: number = MIN_NAME_LENGTH;
    readonly maxNameLength: number = MAX_NAME_LENGTH;
    readonly maxTime: number = MAX_TIME;
    readonly minTime: number = MIN_TIME;
    readonly defaultTimer: number = DEFAULT_TIMER;
    readonly timerIncrement: number = TIMER_INCREMENT;

    constructor(
        private fb: FormBuilder,
        public roomService: RoomService,
        dictionariesStore: Store<{ dictionaries: string[] }>,
        private store: Store,
    ) {
        store.dispatch(resetAllState());
        this.timer = this.defaultTimer;
        this.dictionaries$ = dictionariesStore.select('dictionaries');
        store.dispatch(loadDictionaries());
    }

    ngOnInit(): void {
        this.settingsForm = this.fb.group({
            name: ['', [Validators.required, Validators.minLength(this.minNameLength), Validators.maxLength(this.maxNameLength)]],
            selectedDictionary: ['', Validators.required],
        });
    }

    incrementTime(): void {
        if (this.timer < this.maxTime) this.timer += this.timerIncrement;
    }

    decrementTime(): void {
        if (this.timer > this.minTime) this.timer -= this.timerIncrement;
    }

    onSubmit(): void {
        const gameOptions = new GameOptions(this.settingsForm.controls.name.value, this.settingsForm.controls.selectedDictionary.value, this.timer);
        this.store.dispatch(createRoom({ gameOptions }));
    }

    timerToString(): string {
        if (this.timer === MIN_TIME) {
            return `${Math.floor(this.timer / SECONDS_IN_MINUTE)}:${(this.timer % SECONDS_IN_MINUTE).toString().padStart(2, '0')} sec`;
        } else {
            return `${Math.floor(this.timer / SECONDS_IN_MINUTE)}:${(this.timer % SECONDS_IN_MINUTE).toString().padStart(2, '0')} min`;
        }
    }
}
