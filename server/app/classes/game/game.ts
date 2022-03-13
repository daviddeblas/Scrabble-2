import { GameConfig } from '@app/classes/game-config';
import { GameFinishStatus } from '@app/classes/game-finish-status';
import { GameError, GameErrorType } from '@app/classes/game.exception';
import { PlacedLetter } from '@app/classes/placed-letter';
import { GameOptions } from 'common/classes/game-options';
import { BLANK_LETTER, Letter } from 'common/classes/letter';
import { Vec2 } from 'common/classes/vec2';
import { Bag } from './bag';
import { Board } from './board';
import { Player } from './player';

const MAX_TURNS_SKIPPED = 6;
export const MAX_LETTERS_IN_EASEL = 7;
export const BONUS_POINTS_FOR_FULL_EASEL = 50;
export const MILLISECONDS_PER_SEC = 1000;

export class Game {
    players: Player[];
    board: Board;
    activePlayer: number;
    bag: Bag;
    turnsSkipped: number;
    placeCounter: number;
    gameFinished: boolean;
    currentTimer: NodeJS.Timeout;

    constructor(
        public config: GameConfig,
        playerNames: string[],
        public gameOptions: GameOptions,
        private actionAfterTimeout: () => void,
        public actionAfterTurn: () => void,
    ) {
        this.bag = new Bag(config);
        this.board = new Board(config);
        this.activePlayer = Math.floor(Math.random() * playerNames.length);
        this.players = [];
        playerNames.forEach((name) => this.players.push(new Player(name)));
        this.turnsSkipped = 0;
        this.players.forEach((p) => p.addLetters(this.bag.getLetters(MAX_LETTERS_IN_EASEL)));
        this.placeCounter = 0;
        this.gameFinished = false;
        this.initTimer();
    }

    place(letters: PlacedLetter[], blanks: number[], player: number): void {
        const easelLettersForMove = letters.map((l, index) => {
            if (blanks.filter((b) => b === index).length > 0) return '*' as Letter;
            return l.letter;
        });
        this.checkMove(easelLettersForMove, player);
        if (this.placeCounter === 0) {
            const lettersInCenter = letters.filter((l) =>
                l.position.equals(new Vec2((this.config.boardSize.x - 1) / 2, (this.config.boardSize.y - 1) / 2)),
            );
            if (lettersInCenter.length === 0) throw new GameError(GameErrorType.BadStartingMove);
        }
        this.getActivePlayer().score += this.board.place(letters, blanks, this.placeCounter === 0);
        if (letters.length === MAX_LETTERS_IN_EASEL) this.getActivePlayer().score += BONUS_POINTS_FOR_FULL_EASEL;
        this.getActivePlayer().removeLetters(easelLettersForMove);
        this.getActivePlayer().addLetters(this.bag.getLetters(letters.length));
        if (this.needsToEnd()) this.getActivePlayer().score += this.endGameBonus();
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

    needsToEnd(): boolean {
        if (this.gameFinished) return false;
        if (this.turnsSkipped >= MAX_TURNS_SKIPPED) return true;
        if (this.players.filter((p) => p.easel.length === 0).length > 0 && this.bag.letters.length === 0) return true;
        return false;
    }

    endGame(): GameFinishStatus {
        if (!this.gameFinished) this.endGameScoreAdjustment();
        this.gameFinished = true;
        return this.getGameEndStatus();
    }

    nextTurn(): void {
        this.activePlayer = this.nextPlayer();
    }

    getGameStatus(playerNumber: number): unknown {
        const opponent = { ...this.players[(playerNumber + 1) % 2] };
        opponent.easel = opponent.easel.map(() => BLANK_LETTER);
        return {
            status: {
                activePlayer: this.players[this.activePlayer].name,
                letterPotLength: this.bag.letters.length,
                timer: this.gameOptions.timePerRound,
            },
            players: { player: this.players[playerNumber], opponent },
            board: {
                board: this.board.board,
                pointsPerLetter: Array.from(this.board.pointsPerLetter),
                multipliers: this.board.multipliers,
                blanks: this.board.blanks,
            },
        };
    }

    initTimer(): void {
        this.currentTimer = setTimeout(this.actionAfterTimeout, this.gameOptions.timePerRound * MILLISECONDS_PER_SEC);
    }

    resetTimer(): void {
        clearTimeout(this.currentTimer);
        this.initTimer();
    }

    stopTimer(): void {
        clearTimeout(this.currentTimer);
    }

    private getGameEndStatus(): GameFinishStatus {
        return new GameFinishStatus(this.players, this.bag.letters.length, this.determineWinner());
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
