import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GameOptions } from '@app/classes/game-options';
import { SocketClientService } from '@app/services/socket-client.service';

const MAX_TIME = 300;
const MIN_TIME = 30;
const DEFAULT_TIMER = 60;
const TIMER_INCREMENT = 30;
const MIN_INPUT_LENGTH = 3;
const MAX_INPUT_LENGTH = 20;

@Component({
    selector: 'app-multi-config-window',
    templateUrl: './multi-config-window.component.html',
    styleUrls: ['./multi-config-window.component.scss'],
})
export class MultiConfigWindowComponent implements OnInit {
    settingsForm: FormGroup;
    dictionaries: string[];
    timer: number;
    readonly minLength: number = MIN_INPUT_LENGTH;
    readonly maxLength: number = MAX_INPUT_LENGTH;

    constructor(private fb: FormBuilder, public socketService: SocketClientService) {
        this.timer = DEFAULT_TIMER;
    }

    ngOnInit(): void {
        this.settingsForm = this.fb.group({
            name: ['', [Validators.required, Validators.minLength(this.minLength), Validators.maxLength(this.maxLength)]],
            selectedDictionary: ['', Validators.required],
        });
        this.connect();
        this.configureBaseSocketFeatures();
        this.socketService.send('get dictionaries');
    }

    connect(): void {
        if (!this.socketService.isSocketAlive()) {
            this.socketService.connect();
        }
    }

    configureBaseSocketFeatures(): void {
        // Récupère la liste des dictionnaires disponibles
        this.socketService.on('receive dictionaries', (dictionaries: string[]) => {
            this.dictionaries = dictionaries;
        });
    }

    incrementTime(): void {
        if (this.timer < MAX_TIME) this.timer += TIMER_INCREMENT;
    }

    decrementTime(): void {
        if (this.timer > MIN_TIME) this.timer -= TIMER_INCREMENT;
    }

    onSubmit(): void {
        const gameOptions: GameOptions = {
            hostname: this.settingsForm.controls.name.value,
            dictionaryType: this.settingsForm.controls.selectedDictionary.value,
            timePerRound: this.timer,
        };
        this.socketService.send('create room', gameOptions);
    }
}
