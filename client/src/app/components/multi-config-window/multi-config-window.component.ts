import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { loadDictionaries } from '@app/actions/dictionaries.actions';
import { GameOptions } from '@app/classes/game-options';
import { RoomService } from '@app/services/room.service';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

const MAX_TIME = 300;
const MIN_TIME = 30;
const DEFAULT_TIMER = 60;
const TIMER_INCREMENT = 30;
const MIN_NAME_LENGTH = 3;
const MAX_NAME_LENGTH = 20;

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

    constructor(private fb: FormBuilder, public roomService: RoomService, dictionariesStore: Store<{ dictionaries: string[] }>, store: Store) {
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
        const gameOptions: GameOptions = {
            hostname: this.settingsForm.controls.name.value,
            dictionaryType: this.settingsForm.controls.selectedDictionary.value,
            timePerRound: this.timer,
        };
        this.roomService.createRoom(gameOptions);
    }
}
