import { GameConfig } from '@app/classes/game-config';
import { GameError, GameErrorType } from '@app/classes/game.exception';
import { BLANK_LETTER, Letter } from '@app/classes/letter';
import { Multiplier, MultiplierType } from '@app/classes/multiplier';
import { PlacedLetter } from '@app/classes/placed-letter';
import { Vec2 } from '@app/classes/vec2';

const ALLOWED_DIRECTIONS = [new Vec2(1, 0), new Vec2(0, 1)];

export class Board {
    board: (Letter | null)[][];
    multipliers: (Multiplier | null)[][];
    pointsPerLetter: Map<Letter, number>;
    blanks: Vec2[];

    constructor(private config: GameConfig) {
        this.board = new Array(config.boardSize.x);
        this.multipliers = new Array(config.boardSize.x);
        for (let i = 0; i < config.boardSize.x; i++) {
            this.multipliers[i] = new Array(config.boardSize.y);
            this.board[i] = new Array(config.boardSize.y);
            for (let j = 0; j < config.boardSize.y; j++) {
                this.board[i][j] = null;
                this.multipliers[i][j] = null;
            }
        }
        this.pointsPerLetter = new Map();
        config.letters.forEach((l) => this.pointsPerLetter.set(l.letter, l.points));
        config.multipliers.forEach((m) =>
            m.positions.forEach((p) => {
                this.multipliers[p.x][p.y] = m.multiplier;
            }),
        );
        this.blanks = [];
    }

    place(letters: PlacedLetter[]): number {
        const words = this.getAffectedWords(letters);
        words.forEach((w) => {
            if (!this.config.dictionary.isWord(w.map((l) => l.letter))) throw new GameError(GameErrorType.InvalidWord);
        });

        letters.forEach((l) => {
            this.board[l.position.x][l.position.y] = l.letter;
            if (l.letter === BLANK_LETTER) this.blanks.push(new Vec2(l.position.x, l.position.y));
        });

        let score = 0;
        words.forEach((w) => {
            score += this.scorePositions(w.map((l) => l.position.copy()));
        });

        return score;
    }

    scorePositions(pos: Vec2[]): number {
        let score = 0;
        let multiplier = 1;
        pos.forEach((vec) => {
            // get current letter
            const letter = this.board[vec.x][vec.y];
            if (letter === null) throw new GameError(GameErrorType.LetterIsNull);
            // prendre ne nombre de points associe a cette lettre
            const letterPoints = this.pointsPerLetter.get(letter) as number;
            // annuler s'il s'agit d'un blank
            if (this.blanks.findIndex((p) => p.equals(vec)) >= 0) return;
            // obtenir le multiplieur a cette position
            const multi = this.multipliers[vec.x][vec.y];
            if (multi === null) {
                score += letterPoints;
                return;
            }
            switch (multi.type) {
                case MultiplierType.Letter:
                    score += letterPoints * multi.amt;
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

    letterAt(vec: Vec2): Letter | null {
        return this.board[vec.x][vec.y];
    }

    copy(): Board {
        const returnValue = new Board(this.config);

        this.blanks.forEach((b) => returnValue.blanks.push(b.copy()));

        for (let i = 0; i < this.config.boardSize.x; i++) {
            for (let j = 0; j < this.config.boardSize.y; j++) {
                returnValue.board[i][j] = this.board[i][j];
                returnValue.multipliers[i][j] = this.multipliers[i][j];
            }
        }
        this.pointsPerLetter.forEach((value, key) => {
            returnValue.pointsPerLetter.set(key, value);
        });

        return returnValue;
    }

    private getAffectedWords(letters: PlacedLetter[]): PlacedLetter[][] {
        const tempBoard = this.copy();
        letters.forEach((l) => {
            tempBoard.board[l.position.x][l.position.y] = l.letter;
        });
        const words: PlacedLetter[][] = [];
        letters.forEach((l) => {
            ALLOWED_DIRECTIONS.forEach((d) => {
                const word = tempBoard.getAffectedWordFromSinglePlacement(d, l.position);
                if (word.length < 2) return;
                // ajouter s'il nexiste pas
                const index = words.findIndex((w) => {
                    let bool = true;
                    for (let i = 0; i < w.length && i < word.length; i++) bool &&= w[i].equals(word[i]);
                    return bool;
                });
                if (index < 0) words.push(word);
            });
        });
        return words;
    }

    private getAffectedWordFromSinglePlacement(direction: Vec2, pos: Vec2): PlacedLetter[] {
        let checkingPosition = new Vec2(pos.x, pos.y);
        const word: PlacedLetter[] = [];
        while (this.letterAt(checkingPosition) !== null) checkingPosition = checkingPosition.sub(direction);
        checkingPosition = checkingPosition.add(direction);
        while (this.letterAt(checkingPosition) !== null) {
            word.push(new PlacedLetter(this.letterAt(checkingPosition) as Letter, checkingPosition.copy()));
            checkingPosition = checkingPosition.add(direction);
        }
        return word;
    }
}
