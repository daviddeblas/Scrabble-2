import { GameError, GameErrorType } from '@app/classes/game.exception';
import { Letter } from '@app/classes/letter';
import { Multiplier, MultiplierType } from '@app/classes/multiplier';
import { PlacedLetter } from '@app/classes/placed-letter';
import { Player } from '@app/classes/player';
import { Vec2 } from '@app/classes/vec2';
import { DictionaryService } from '@app/services/dictionary.service';
import { GameConfigService } from '@app/services/game-config.service';
import Container from 'typedi';
import { GameFinishStatus } from './game-finish-status';

export const AMT_OF_LETTERS_IN_EASEL = 7;
export const BOARD_WIDTH = 15;
export const BOARD_HEIGHT = 15;
const STARTING_HEIGHT = 6;
const STARTING_WIDTH = 6;
const STARTING_POSITION = new Vec2(STARTING_WIDTH, STARTING_HEIGHT);
const MAX_TURNS_PASSED = 5;

export class ClassicGame {
    players: Player[];
    board: (Letter | null)[][];
    multipliers: (Multiplier | null)[][];
    activePlayer: number;
    letterPot: Letter[];
    pointPerLetter: Map<Letter, number>;
    gameStarting: boolean;
    turnsPassed: number;

    constructor(
        private onFinish: (info: GameFinishStatus) => void = () => {
            return;
        },
    ) {
        this.turnsPassed = 0;
        this.gameStarting = true;
        this.players = [new Player('player 1'), new Player('player 2')];
        // TODO trouver une facon de lire un fichier qui dicte board
        this.board = new Array(BOARD_WIDTH);
        for (let i = 0; i < this.board.length; i++) {
            this.board[i] = new Array(BOARD_HEIGHT);
            for (let j = 0; j < this.board.length; j++) {
                this.board[i][j] = null;
            }
        }
        this.multipliers = new Array(BOARD_WIDTH);
        for (let i = 0; i < this.multipliers.length; i++) {
            this.multipliers[i] = new Array(BOARD_HEIGHT);
            for (let j = 0; j < this.multipliers.length; j++) {
                this.multipliers[i][j] = null;
            }
        }
        this.activePlayer = 0;
        this.letterPot = [];
        this.pointPerLetter = new Map();
        const config = Container.get(GameConfigService).getConfigFromName('Classic');
        config.multipliers.forEach((mul) => {
            mul.positions.forEach((pos) => {
                this.multipliers[pos.x][pos.y] = new Multiplier(mul.multiplier.amt, mul.multiplier.type);
            });
        });
        config.letters.forEach((l) => {
            for (let i = 0; i < l.amt; i++) {
                this.letterPot.push(l.letter);
            }
            this.pointPerLetter.set(l.letter, l.points);
        });

        // chevalet de depart
        this.players.forEach((p) => {
            for (let i = 0; i < AMT_OF_LETTERS_IN_EASEL; i++)
                p.easel.push(this.letterPot.splice(Math.round(Math.random() * this.letterPot.length), 1)[0]);
        });
    }

    skip(player: number): void {
        this.checkMove([], player);
        this.activePlayer = (this.activePlayer + 1) % this.players.length;
        this.turnsPassed++;
        if (this.isFinished()) {
            this.finishGame(player);
        }
    }

    draw(letters: Letter[], player: number): void {
        if (this.letterPot.length < AMT_OF_LETTERS_IN_EASEL) throw new GameError(GameErrorType.NotEnoughLetters);
        // validation
        this.checkMove(letters, player);
        if (letters.length === 0) {
            // TODO create new errortypes
            throw new GameError(GameErrorType.LetterIsNull);
        }
        // execution
        // enlever les lettres du chevalet du joueur pour le mettre dans le pot
        letters.forEach((l) => {
            this.players[player].easel.splice(this.players[player].easel.indexOf(l as Letter), 1);
            this.letterPot.push(l as Letter);
        });
        // piger les lettres du pot
        for (const l in letters)
            if (l) this.players[player].easel.push(this.letterPot.splice(Math.round(Math.random() * this.letterPot.length), 1)[0]);
        this.activePlayer = (this.activePlayer + 1) % this.players.length;
        this.turnsPassed = 0;
    }

    place(letters: PlacedLetter[], player: number): void {
        this.checkMove(
            letters.map((l) => l.letter),
            player,
        );
        letters.forEach((l) => {
            if (this.letterAt(l.position) !== null) throw new GameError(GameErrorType.PositionOccupied);
        });
        if (this.gameStarting) {
            // TODO new error types
            if (letters.filter((l) => l.position.x === STARTING_POSITION.x && l.position.y === STARTING_POSITION.y).length === 0)
                throw new GameError(GameErrorType.WrongPosition);
        }
        // utilise plus tard pour calculer le score
        const wordsPositions: Vec2[][] = [];
        const tempBoard: (Letter | null)[][] = new Array(BOARD_WIDTH);
        // copie board dans tempBoard en profondeur
        for (let i = 0; i < tempBoard.length; i++) {
            tempBoard[i] = new Array(BOARD_HEIGHT);
            for (let j = 0; j < tempBoard.length; j++) {
                tempBoard[i][j] = this.board[i][j];
            }
        }
        letters.forEach((l) => (tempBoard[l.position.x][l.position.y] = l.letter));
        letters.forEach((l) => {
            let checking = new Vec2(l.position.x, l.position.y);
            let wordPositions: Vec2[] = [];
            let word: Letter[] = [];
            while (checking.x - 1 >= 0 && tempBoard[checking.x - 1][checking.y] !== null) checking.x--;
            while (checking.x <= BOARD_WIDTH && tempBoard[checking.x][checking.y] !== null) {
                wordPositions.push(new Vec2(checking.x, checking.y));
                word.push(tempBoard[checking.x][checking.y] as Letter);
                checking.x++;
            }
            if (word.length > 1) {
                // TODO Validate correctly with blanks
                if (Container.get(DictionaryService).isWord(word)) throw new GameError(GameErrorType.InvalidWord);
                const wordShouldBeAdded =
                    wordsPositions.filter((wordPos) => {
                        let isTheSame = true;
                        for (let i = 0; i < wordPos.length && i < word.length; i++) {
                            isTheSame &&= wordPos[i].x === wordPositions[i].x && wordPos[i].y === wordPositions[i].y;
                            if (!isTheSame) return false;
                        }
                        return isTheSame;
                    }).length === 0;
                if (wordShouldBeAdded) {
                    const index = wordsPositions.push([]) - 1;
                    wordPositions.forEach((vec) => wordsPositions[index].push(new Vec2(vec.x, vec.y)));
                }
            }

            checking = new Vec2(l.position.x, l.position.y);
            wordPositions = [];
            word = [];
            while (checking.y - 1 >= 0 && tempBoard[checking.x][checking.y - 1] !== null) checking.y--;
            while (checking.y <= BOARD_HEIGHT && tempBoard[checking.x][checking.y] !== null) {
                wordPositions.push(new Vec2(checking.x, checking.y));
                word.push(tempBoard[checking.x][checking.y] as Letter);
                checking.y++;
            }
            if (word.length > 1) {
                // TODO Validate correctly with blanks
                if (Container.get(DictionaryService).isWord(word)) throw new GameError(GameErrorType.InvalidWord);
                const wordShouldBeAdded =
                    wordsPositions.filter((wordPos) => {
                        let isTheSame = true;
                        for (let i = 0; i < wordPos.length && i < word.length; i++) {
                            isTheSame &&= wordPos[i].x === wordPositions[i].x && wordPos[i].y === wordPositions[i].y;
                            if (!isTheSame) return false;
                        }
                        return isTheSame;
                    }).length === 0;
                if (wordShouldBeAdded) {
                    const index = wordsPositions.push([]) - 1;
                    wordPositions.forEach((vec) => wordsPositions[index].push(new Vec2(vec.x, vec.y)));
                }
            }
        });
        letters.forEach((l) => {
            this.board[l.position.x][l.position.y] = l.letter;
            this.players[player].easel.splice(this.players[player].easel.indexOf(l.letter), 1);
            if (this.letterPot.length > 0) this.players[player].easel.push(this.takeLetterFromPot());
        });
        if (wordsPositions.length === 0) throw new GameError(GameErrorType.InvalidWord);
        let totalScoreForMove = 0;
        wordsPositions.forEach((w) => {
            totalScoreForMove += this.scoreWord(w);
            w.forEach((pos) => (this.multipliers[pos.x][pos.y] = null));
        });
        this.players[player].score += totalScoreForMove;
        // prochain tour
        this.activePlayer = (this.activePlayer + 1) % this.players.length;
        if (this.gameStarting) this.gameStarting = false;
        this.turnsPassed = 0;
        if (this.isFinished()) {
            this.finishGame(player);
            this.onFinish(new GameFinishStatus(this.players, this.determineWinner()));
        }
    }

    isFinished(): boolean {
        if (this.turnsPassed >= MAX_TURNS_PASSED) return true;
        if (!(this.letterPot.length === 0 || this.players[0].easel.length === 0) || this.players[1].easel.length !== 0) return true;
        return false;
    }

    private finishGame(lastPlayerToPlay: number): void {
        if (this.players[lastPlayerToPlay].easel.length === 0 && this.letterPot.length === 0) {
            this.players[(lastPlayerToPlay + 1) % this.players.length].easel.forEach((letter) => {
                this.players[lastPlayerToPlay].score += this.pointPerLetter[letter];
            });
        }
        this.calculateFinalPoints();
        this.onFinish(new GameFinishStatus(this.players, this.determineWinner()));
    }

    private calculateFinalPoints(): void {
        this.players.forEach((p) => {
            p.easel.forEach((l) => {
                p.score -= this.pointPerLetter[l];
            });
        });
    }

    private checkMove(letters: Letter[], player: number): void {
        if (player !== this.activePlayer) throw new GameError(GameErrorType.WrongPlayer);
        const playerTempEasel = [...this.players[player].easel];
        letters.forEach((l) => {
            const index = playerTempEasel.indexOf(l);
            if (index < 0) {
                throw new GameError(GameErrorType.LettersAreNotInEasel);
            }
            playerTempEasel.splice(index, 1);
        });
    }

    private takeLetterFromPot(): Letter {
        if (this.letterPot.length === 0) throw new Error('Unexpected empty letter pot');
        return this.letterPot.splice(Math.round(Math.random() * this.letterPot.length), 1)[0];
    }

    private scoreWord(positions: Vec2[]): number {
        let score = 0;
        let multiplier = 1;
        positions.forEach((vec) => {
            const letter = this.board[vec.x][vec.y];
            if (letter === null) throw new GameError(GameErrorType.LetterIsNull);
            const letterPoints = this.pointPerLetter.get(letter);
            if (letterPoints === undefined) throw new GameError(GameErrorType.UndefinedPoints);
            const multi = this.multipliers[vec.x][vec.y];
            if (multi !== null) {
                switch (multi.type) {
                    case MultiplierType.Letter:
                        score += letterPoints * (multi.type === MultiplierType.Letter ? multi.amt : 1);
                        break;
                    case MultiplierType.Word:
                        score += letterPoints;
                        multiplier = multiplier < multi.amt ? multi.amt : multiplier;
                        break;
                }
            } else {
                score += letterPoints;
            }
        });
        score *= multiplier;
        return score;
    }

    private letterAt(position: Vec2): Letter | null {
        return this.board[position.x][position.y];
    }

    private determineWinner(): string | null {
        if (this.players[0].score === this.players[1].score) return null;
        if (this.players[0].score < this.players[1].score) return this.players[1].name;
        return this.players[0].name;
    }
}
