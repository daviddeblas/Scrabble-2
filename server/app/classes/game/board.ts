import { GameConfig } from '@app/classes/game-config';
import { GameError, GameErrorType } from '@app/classes/game.exception';
import { Letter } from '@app/classes/letter';
import { Multiplier, MultiplierType } from '@app/classes/multiplier';
import { PlacedLetter } from '@app/classes/placed-letter';
import { Vec2 } from '@app/classes/vec2';

export class Board {
    board: (Letter | null)[][];
    multipliers: (Multiplier | null)[][];
    pointsPerLetter: Map<Letter, number>;
    blanks: Vec2[];
    size: Vec2;

    constructor(config: GameConfig) {
        this.size = new Vec2(config.boardSize.x, config.boardSize.y);
        this.board = new Array(this.size.x);
        this.multipliers = new Array(config.boardSize.x);
        for (let i = 0; i < this.board.length; i++) {
            this.multipliers[i] = new Array(config.boardSize.y);
            this.board[i] = new Array(this.size.y);
            for (let j = 0; j < this.board.length; j++) {
                this.board[i][j] = null;
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

    place(letters: PlacedLetter[]): number {}

    scorePositions(pos: Vec2[]): number {
        let score = 0;
        let multiplier = 1;
        pos.forEach((vec) => {
            // get current letter
            const letter = this.board[vec.x][vec.y];
            if (letter === null) throw new GameError(GameErrorType.LetterIsNull);
            // prendre ne nombre de points associe a cette lettre
            const letterPoints = this.pointsPerLetter.get(letter);
            if (letterPoints === undefined) throw new GameError(GameErrorType.UndefinedPoints);
            // annuler s'il s'agit d'un blank
            if (this.blanks.findIndex((p) => p.equals(vec)) < 0) return;
            // obtenir le multiplieur a cette position
            const multi = this.multipliers[vec.x][vec.y];
            if (multi === null) {
                score += letterPoints;
                return;
            }
            switch (multi.type) {
                case MultiplierType.Letter:
                    score += letterPoints * (multi.type === MultiplierType.Letter ? multi.amt : 1);
                    break;
                case MultiplierType.Word:
                    score += letterPoints;
                    multiplier = multiplier < multi.amt ? multi.amt : multiplier;
                    break;
            }
        });
        score *= multiplier;
        return score;
    }

    wordsGenerated(letters: PlacedLetter[]): string[] {
        const tempBoard: (Letter | null)[][] = new Array(this.size.x);
        // copie board dans tempBoard en profondeur
        for (let i = 0; i < tempBoard.length; i++) {
            tempBoard[i] = new Array(this.size.y);
            for (let j = 0; j < tempBoard.length; j++) {
                tempBoard[i][j] = this.board[i][j];
            }
        }
        letters.forEach((l) => {
            tempBoard[l.position.x][l.position.y] = l.letter;
        });
    }

    checkWord(direction: Vec2, pos: Vec2): string {}
}
