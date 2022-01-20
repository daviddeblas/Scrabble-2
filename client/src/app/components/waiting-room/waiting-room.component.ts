import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { GamePreparationPageComponent } from '@app/pages/game-preparation-page/game-preparation-page.component';
class Player{
  name: string;
  constructor(name : string){
    this.name = name;
  }
}

class GameBoard{
  gameType : string;
  timeSetting : number;
  dictionnary : string;
  player1 : Player;
  player2 : Player;
}

@Component({
  selector: 'app-waiting-room',
  templateUrl: './waiting-room.component.html',
  styleUrls: ['./waiting-room.component.scss']
})
export class WaitingRoomComponent implements OnInit {

  player1 : Player;
  player2 : Player;
  gameBoard : GameBoard;
  constructor(private dialogRef: MatDialogRef<GamePreparationPageComponent>) { 
  }

  ngOnInit(): void {
    this.gameBoard = {gameType : "Waiting", timeSetting : 90, dictionnary: "Dictionnaire Français", player1: this.player1, player2: this.player2};
    this.player1 = {name:"Jackie"};
  }
  
  set setPlayer2(player : Player){
    if(player.name && !this.player2){
      this.player2 = player;
    }
  }
  closeDialog(){
    this.dialogRef.close();
  }
  playerArrival(): void{
    this.player2 = {name:"Francis"};
  }
}
