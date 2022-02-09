import { GameConfig } from '@app/classes/game-config';
import { GameError, GameErrorType } from '@app/classes/game.exception';
import { Letter } from '@app/classes/letter';
import { PlacedLetter } from '@app/classes/placed-letter';
import { Bag } from './bag';
import { Board } from './board';
import { Player } from './player';

export class Game {
    players: Player[];
    board: Board;
    activePlayer: number;
    bag: Bag;

    constructor(public config: GameConfig, playerNames: string[]) {
        this.bag = new Bag(config);
        this.board = new Board(config);
        this.activePlayer = Math.floor(Math.random() * playerNames.length);
        this.players = [];
        playerNames.forEach((name) => this.players.push(new Player(name)));
    }

    place(letters: PlacedLetter[], player: number): void {
        this.checkMove(
            letters.map((l) => l.letter),
            player,
        );

        this.board.place(letters);
        this.getActivePlayer().removeLetters(letters.map((l) => l.letter));
        this.getActivePlayer().addLetters(this.bag.getLetters(letters.length));
        this.nextTurn();
    }

    draw(letters: Letter[], player: number): void {
        this.checkMove(letters, player);
        this.getActivePlayer().removeLetters(letters);
        this.bag.exchangeLetters(letters);
        this.nextTurn();
    }

    skip(player: number): void {
        this.draw([], player);
    }

    private checkMove(letters: Letter[], player: number): void {
        if (player !== this.activePlayer) throw new GameError(GameErrorType.WrongPlayer);
        const playerTempEasel = [...this.players[player].easel];
        letters.forEach((l) => {
            const index = playerTempEasel.indexOf(l);
            if (index < 0) throw new GameError(GameErrorType.LettersAreNotInEasel);
            playerTempEasel.splice(index, 1);
        });
    }

    private nextTurn(): void {
        this.activePlayer = (this.activePlayer + 1) % this.players.length;
    }

    private getActivePlayer(): Player {
        return this.players[this.activePlayer];
    }
}
