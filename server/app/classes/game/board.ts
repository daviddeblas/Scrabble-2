import { GameConfig } from '@app/classes/game-config';
import { GameError, GameErrorType } from '@app/classes/game.exception';
import { Letter } from '@app/classes/letter';
import { Multiplier, MultiplierType } from '@app/classes/multiplier';
import { PlacedLetter } from '@app/classes/placed-letter';
import { Vec2 } from '@app/classes/vec2';

const ALLOWED_DIRECTIONS = [new Vec2(1, 0), new Vec2(0, 1)];

export const createEmptyMatrix = (dimensions: Vec2) => {
    const matrix = new Array(dimensions.x);
    for (let i = 0; i < dimensions.x; i++) {
        matrix[i] = new Array(dimensions.y);
        for (let j = 0; j < dimensions.y; j++) matrix[i][j] = null;
    }
    return matrix;
};

export class Board {
    board: (Letter | null)[][];
    multipliers: (Multiplier | null)[][];
    pointsPerLetter: Map<Letter, number>;
    blanks: Vec2[];

    constructor(private config: GameConfig) {
        this.board = createEmptyMatrix(config.boardSize);
        this.multipliers = createEmptyMatrix(config.boardSize);
        this.pointsPerLetter = new Map();

        config.letters.forEach((l) => this.pointsPerLetter.set(l.letter, l.points));
        config.multipliers.forEach((m) =>
            m.positions.forEach((p) => {
                this.multipliers[p.x][p.y] = m.multiplier;
            }),
        );

        this.blanks = [];
    }

    place(letters: PlacedLetter[], blanks: number[], firstMove: boolean): number {
        if (letters.filter((l) => l.position.x >= this.config.boardSize.x || l.position.y >= this.config.boardSize.y).length > 0)
            throw new Error('letter out of bound');
        const words = this.getAffectedWords(letters);
        const allPlacedLetters = words.reduce((arr, currentValue) => [...arr, ...currentValue]);
        if (!firstMove && allPlacedLetters.length === letters.length) throw new Error('word placement does not connect to other words');
        words.forEach((w) => {
            if (!this.config.dictionary.isWord(w.map((l) => l.letter))) throw new GameError(GameErrorType.InvalidWord);
        });

        letters.forEach((l) => {
            this.board[l.position.x][l.position.y] = l.letter;
        });

        blanks.forEach((v) => this.blanks.push(letters[v].position.copy()));

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
            const letter = this.board[vec.x][vec.y];
            if (letter === null) throw new GameError(GameErrorType.LetterIsNull);
            // prends le nombre de points associe a cette lettre
            const letterPoints = this.pointsPerLetter.get(letter) as number;
            // annule s'il s'agit d'un blank
            if (this.blanks.findIndex((p) => p.equals(vec)) >= 0) return;
            // obtient le multiplieur a cette position
            const multi = this.multipliers[vec.x][vec.y];
            if (multi === null) {
                score += letterPoints;
                return;
            }
            switch (multi.type) {
                case MultiplierType.Letter:
                    score += letterPoints * multi.amount;
                    break;
                case MultiplierType.Word:
                    score += letterPoints;
                    multiplier = multiplier < multi.amount ? multi.amount : multiplier;
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
                // ajoute s'il n'existe pas
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

        while (!this.positionOutOfBound(checkingPosition) && this.letterAt(checkingPosition) !== null) {
            checkingPosition = checkingPosition.sub(direction);
        }
        checkingPosition = checkingPosition.add(direction);

        while (this.letterAt(checkingPosition) !== null) {
            word.push(new PlacedLetter(this.letterAt(checkingPosition) as Letter, checkingPosition.copy()));
            checkingPosition = checkingPosition.add(direction);
        }

        return word;
    }

    private positionOutOfBound(pos: Vec2): boolean {
        return pos.x < 0 || pos.y < 0 || pos.x > this.config.boardSize.x - 1 || pos.y > this.config.boardSize.y - 1;
    }
}
