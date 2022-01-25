import { Component, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { GameOptions } from '@app/classes/game-options';
import { GamePreparationPageComponent } from '@app/pages/game-preparation-page/game-preparation-page.component';
import { SocketClientService } from '@app/services/socket-client.service';

@Component({
    selector: 'app-waiting-room',
    templateUrl: './waiting-room.component.html',
    styleUrls: ['./waiting-room.component.scss'],
})
export class WaitingRoomComponent implements OnInit {
    @Input() stepper: MatStepper;
    player1: string;
    player2: string;
    timer: number;
    dictionary: string;
    constructor(private dialogRef: MatDialogRef<GamePreparationPageComponent>, public socketService: SocketClientService) {}

    ngOnInit(): void {
        this.connect();
        this.configureBaseSocketFeatures();
    }

    connect() {
        if (!this.socketService.isSocketAlive()) {
            this.socketService.connect();
        }
    }

    configureBaseSocketFeatures() {
        // Récupère la liste des dictionnaires disponibles
        this.socketService.on('game settings', (gameOptions: GameOptions) => {
            this.player1 = gameOptions.hostname;
            this.timer = gameOptions.timePerRound;
            this.dictionary = gameOptions.dictionaryType;
        });
        this.socketService.on('player joining', (playerName: string) => {
            this.player2 = playerName;
        });
    }

    closeDialog() {
        this.socketService.send('accept');
        this.dialogRef.close();
    }
    rejectInvite() {
        this.socketService.send('refuse');
        this.player2 = '';
    }
    quitWaitingRoom() {
        if (this.player2) {
            this.socketService.send('refuse');
            this.socketService.send('quit');
            this.player2 = '';
        }
        this.stepper.reset();
    }
}
