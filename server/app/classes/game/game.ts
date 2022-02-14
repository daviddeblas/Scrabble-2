import { GameConfig } from '@app/classes/game-config';
import { GameFinishStatus } from '@app/classes/game-finish-status';
import { GameError, GameErrorType } from '@app/classes/game.exception';
import { Letter } from '@app/classes/letter';
import { PlacedLetter } from '@app/classes/placed-letter';
import { Vec2 } from '@app/classes/vec2';
import { Bag } from './bag';
import { Board } from './board';
import { Player } from './player';

const MAX_TURNS_SKIPPED = 5;
export const MAX_LETTERS_IN_EASEL = 7;
export const BONUS_POINTS_FOR_FULL_EASEL = 50;

export class Game {
    players: Player[];
    board: Board;
    activePlayer: number;
    bag: Bag;
    turnsSkipped: number;
    placeCounter: number;

    constructor(public config: GameConfig, playerNames: string[]) {
        this.bag = new Bag(config);
        this.board = new Board(config);
        this.activePlayer = Math.floor(Math.random() * playerNames.length);
        this.players = [];
        playerNames.forEach((name) => this.players.push(new Player(name)));
        this.turnsSkipped = 0;
        this.players.forEach((p) => p.addLetters(this.bag.getLetters(MAX_LETTERS_IN_EASEL)));
        this.placeCounter = 0;
    }

    place(letters: PlacedLetter[], player: number): void {
        this.checkMove(
            letters.map((l) => l.letter),
            player,
        );
        const lettersInCenter = letters.filter((l) =>
            l.position.equals(new Vec2((this.config.boardSize.x - 1) / 2, (this.config.boardSize.y - 1) / 2)),
        );
        if (lettersInCenter.length === 0) throw new Error('bad starting move');
        this.getActivePlayer().score += this.board.place(letters);
        if (letters.length === MAX_LETTERS_IN_EASEL) this.getActivePlayer().score += BONUS_POINTS_FOR_FULL_EASEL;
        this.getActivePlayer().removeLetters(letters.map((l) => l.letter));
        this.getActivePlayer().addLetters(this.bag.getLetters(letters.length));
        if (this.gameEnded()) this.getActivePlayer().score += this.endGameBonus();
        this.nextTurn();
        this.turnsSkipped = 0;
        this.placeCounter++;
    }

    draw(letters: Letter[], player: number): void {
        if (this.bag.letters.length < MAX_LETTERS_IN_EASEL) throw new GameError(GameErrorType.NotEnoughLetters);
        this.checkMove(letters, player);
        this.getActivePlayer().removeLetters(letters);
        this.getActivePlayer().addLetters(this.bag.exchangeLetters(letters));
        this.nextTurn();
        this.turnsSkipped = 0;
    }

    skip(player: number): void {
        this.checkMove([], player);
        this.nextTurn();
        this.turnsSkipped++;
    }

    gameEnded(): boolean {
        if (this.turnsSkipped >= MAX_TURNS_SKIPPED) return true;
        if (this.players.filter((p) => p.easel.length === 0).length > 0 && this.bag.letters.length === 0) return true;
        return false;
    }

    endGame(): GameFinishStatus {
        this.endGameScoreAdjustment();
        return this.getGameEndStatus();
    }

    private getGameEndStatus(): GameFinishStatus {
        return new GameFinishStatus(this.players, this.determineWinner());
    }

    private endGameBonus(): number {
        return this.getNextPlayer()
            .easel.map((l) => this.board.pointsPerLetter.get(l) as number)
            .reduce((sum, n) => sum + n);
    }

    private endGameScoreAdjustment(): void {
        this.players.forEach((p) => {
            p.easel.forEach((l) => {
                p.score -= this.board.pointsPerLetter.get(l) as number;
            });
        });
    }

    private determineWinner(): string | null {
        if (this.players.filter((p) => p.score === this.players[0].score).length === this.players.length) return null;
        const winningPlayer = this.players.reduce((playerWithMostPoints, currentPlayer) =>
            currentPlayer.score > playerWithMostPoints.score ? currentPlayer : playerWithMostPoints,
        );
        return winningPlayer.name;
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
        this.activePlayer = this.nextPlayer();
    }

    private nextPlayer(): number {
        return (this.activePlayer + 1) % this.players.length;
    }

    private getNextPlayer(): Player {
        return this.players[this.nextPlayer()];
    }

    private getActivePlayer(): Player {
        return this.players[this.activePlayer];
    }
}
