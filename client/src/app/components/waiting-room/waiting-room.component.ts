import { Component, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { GamePreparationPageComponent } from '@app/pages/game-preparation-page/game-preparation-page.component';

/*
 *   #TODO : Enelever ces classes une fois déclarés dans les services.
 */
class Player {
    name: string;
}

class GameBoard {
    gameType: string;
    timeSetting: number;
    dictionary: string;
    player1: Player;
    player2: Player;
}

@Component({
    selector: 'app-waiting-room',
    templateUrl: './waiting-room.component.html',
    styleUrls: ['./waiting-room.component.scss'],
})
export class WaitingRoomComponent implements OnInit {
    static dialog(dialog: any, arg1: string) {
        throw new Error('Method not implemented.');
    }
    
    @Input() stepper: MatStepper;
    player1: Player;
    player2: Player;
    gameBoard: GameBoard;
    constructor(private dialogRef: MatDialogRef<GamePreparationPageComponent>) {}

    ngOnInit(): void {
        this.gameBoard = { gameType: 'Waiting', timeSetting: 90, dictionary: 'Dictionnaire Français', player1: this.player1, player2: this.player2 };
        this.player1 = { name: 'Jackie' };
    }

    set setPlayer2(player: Player) {
        if (player.name && !this.player2) {
            this.player2 = player;
        }
    }
  
    playerArrival(): void {
        this.player2 = { name: 'Francis' };
    }

    closeDialog(){
        this.dialogRef.close();
    }
}
