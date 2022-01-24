import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GameOptions } from '@app/classes/game-options';
import { SocketClientService } from '@app/services/socket-client.service';

@Component({
    selector: 'app-multi-config-window',
    templateUrl: './multi-config-window.component.html',
    styleUrls: ['./multi-config-window.component.scss'],
})
export class MultiConfigWindowComponent implements OnInit {
    settingsForm: FormGroup;
    dictionaries: string[];
    timer: number;
    private maxTime: number = 300;
    private minTime: number = 30;
    private startTime: number = 60;

    constructor(private fb: FormBuilder, public socketService: SocketClientService) {
        this.timer = this.startTime;
    }

    ngOnInit(): void {
        this.settingsForm = this.fb.group({
            name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
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
        if (this.timer < this.maxTime) this.timer += 30;
    }

    decrementTime(): void {
        if (this.timer > this.minTime) this.timer -= 30;
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
