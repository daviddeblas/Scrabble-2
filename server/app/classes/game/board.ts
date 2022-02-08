import { Letter } from '@app/classes/letter';
import { Multiplier } from '@app/classes/multiplier';
import { PlacedLetter } from '@app/classes/placed-letter';
import { GameConfig } from '@app/classes/game-config';

export class Board {
    board: (Letter | null)[][];
    multipliers: (Multiplier | null)[][];
    pointsPerLetter: Map<Letter, number>;

    constructor(config: GameConfig) {
        this.board = new Array(config.boardSize.x);
        for (let i = 0; i < this.board.length; i++) {
            this.board[i] = new Array(config.boardSize.y);
            for (let j = 0; j < this.board.length; j++) {
                this.board[i][j] = null;
            }
        }
        this.multipliers = new Array(config.boardSize.x);
        for (let i = 0; i < this.multipliers.length; i++) {
            this.multipliers[i] = new Array(config.boardSize.y);
            for (let j = 0; j < this.multipliers.length; j++) {
                this.multipliers[i][j] = null;
            }
        }
        config.letters.forEach((l) => this.pointsPerLetter.set(l.letter, l.points));
        config.multipliers.forEach((m) =>
            m.positions.forEach((p) => {
                this.multipliers[p.x][p.y] = m.multiplier;
            }),
        );
    }

    place(letters: PlacedLetter[]): number {

    }

    wordsGenerated(letters: PlacedLetter[]): string[] {

    }
}
