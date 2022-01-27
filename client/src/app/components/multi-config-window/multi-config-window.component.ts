import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GameOptions } from '@app/classes/game-options';
import { SocketClientService } from '@app/services/socket-client.service';

const MAX_TIME = 300;
const MIN_TIME = 30;
const START_TIME = 60;
const INCREMENT = 30;

@Component({
    selector: 'app-multi-config-window',
    templateUrl: './multi-config-window.component.html',
    styleUrls: ['./multi-config-window.component.scss'],
})
export class MultiConfigWindowComponent implements OnInit {
    settingsForm: FormGroup;
    dictionaries: string[];
    timer: number;

    constructor(private fb: FormBuilder, public socketService: SocketClientService) {
        this.timer = START_TIME;
    }

    ngOnInit(): void {
        const minLength = 3;
        const maxLength = 20;
        this.settingsForm = this.fb.group({
            name: ['', [Validators.required, Validators.minLength(minLength), Validators.maxLength(maxLength)]],
            selectedDictionary: ['', Validators.required],
        });
        this.connect();
        this.configureBaseSocketFeatures();
        this.socketService.send('get dictionaries');
    }

    connect() {
        if (!this.socketService.isSocketAlive()) {
            this.socketService.connect();
        }
    }

    configureBaseSocketFeatures() {
        // Récupère la liste des dictionnaires disponibles
        this.socketService.on('receive dictionaries', (dictionaries: string[]) => {
            this.dictionaries = dictionaries;
        });
    }

    incrementTime(): void {
        if (this.timer < MAX_TIME) this.timer += INCREMENT;
    }

    decrementTime(): void {
        if (this.timer > MIN_TIME) this.timer -= INCREMENT;
    }

    onSubmit() {
        const gameOptions: GameOptions = {
            hostname: this.settingsForm.controls.name.value,
            dictionaryType: this.settingsForm.controls.selectedDictionary.value,
            timePerRound: this.timer,
        };
        this.socketService.send('create room', gameOptions);
    }
}
