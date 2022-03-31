import { Component } from '@angular/core';
import { GameHistory } from 'common/interfaces/game-history';

@Component({
    selector: 'app-game-history-table',
    templateUrl: './game-history-table.component.html',
    styleUrls: ['./game-history-table.component.scss'],
})
export class GameHistoryTableComponent {
    displayedColumns: string[] = [
        'id',
        'date',
        'gameDuration',
        'namePlayer1',
        'scorePlayer1',
        'namePlayer2',
        'scorePlayer2',
        'gameMode',
        'isSurrender',
    ];
    dataSource = ELEMENT_DATA;
}

const ELEMENT_DATA: GameHistory[] = [
    {
        date: '10-5-2022',
        gameDuration: 10,
        namePlayer1: 'David',
        scorePlayer1: 700,
        namePlayer2: 'BOTTY',
        scorePlayer2: 30,
        gameMode: 'classic',
        isSurrender: false,
    },
    {
        date: '10-5-2022',
        gameDuration: 10,
        namePlayer1: 'Charles',
        scorePlayer1: 200,
        namePlayer2: 'Jean',
        scorePlayer2: 160,
        gameMode: 'log2990',
        isSurrender: false,
    },
];
