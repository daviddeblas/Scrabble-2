import { Player } from '@app/classes/player';
import { Letter } from '@app/classes/letter';
import { GameError, GameErrorType } from '@app/classes/game.exception';
import { PlacedLetter } from '@app/classes/placed-letter';
import { Vec2 } from '@app/classes/vec2';
import { DictionaryService } from '@app/services/dictionary.service';
import { Box } from '@app/classes/box';
import { MultiplierType } from '@app/classes/multiplier';
import { LetterConfigService } from '@app/services/letter-config.service';

export const AMT_OF_LETTERS_IN_EASEL = 7;
export const BOARD_WIDTH = 15;
export const BOARD_HEIGHT = 15;
const STARTING_HEIGHT = 6;
const STARTING_WIDTH = 6;
const STARTING_POSITION = new Vec2(STARTING_WIDTH, STARTING_HEIGHT);

export class ClassicGame {
    players: Player[];
    board: Box[][];
    activePlayer: number;
    letterPot: Letter[];
    pointPerLetter: Map<Letter, number>;
    gameStarting: boolean;

    constructor(private dictionaryService: DictionaryService, letterConfigService: LetterConfigService) {
        this.gameStarting = true;
        this.players = [new Player('player 1'), new Player('player 2')];
        // TODO trouver une facon de lire un fichier qui dicte board
        this.board = new Array(BOARD_WIDTH);
        for (let i = 0; i < this.board.length; i++) {
            this.board[i] = new Array(BOARD_HEIGHT);
            for (let j = 0; j < this.board.length; j++) {
                this.board[i][j] = new Box(null, null);
            }
        }
        this.activePlayer = 0;
        this.letterPot = [];
        this.pointPerLetter = new Map();
        const config = letterConfigService.getConfigFromName('Classic');
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
    }

    draw(letters: Letter[], player: number): void {
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
                throw new GameError(GameErrorType.InvalidWord);
        }
        // utilise plus tard pour calculer le score
        const wordsPositions: Vec2[][] = [];
        const tempBoard: Box[][] = new Array(BOARD_WIDTH);
        // copie board dans tempBoard en profondeur
        for (let i = 0; i < tempBoard.length; i++) {
            tempBoard[i] = new Array(BOARD_HEIGHT);
            for (let j = 0; j < tempBoard.length; j++) {
                tempBoard[i][j] = new Box(this.board[i][j].letter, this.board[i][j].multiplier);
            }
        }
        letters.forEach((l) => (tempBoard[l.position.x][l.position.y].letter = l.letter));
        letters.forEach((l) => {
            let checking = new Vec2(l.position.x, l.position.y);
            let wordPositions: Vec2[] = [];
            let word: Letter[] = [];
            while (checking.x - 1 >= 0 && tempBoard[checking.x - 1][checking.y].letter !== null) checking.x--;
            while (checking.x <= BOARD_WIDTH && tempBoard[checking.x][checking.y].letter !== null) {
                wordPositions.push(new Vec2(checking.x, checking.y));
                word.push(tempBoard[checking.x][checking.y].letter as Letter);
                checking.x++;
            }
            if (word.length > 1) {
                // TODO Validate correctly with blanks
                if (this.dictionaryService.isWord(word)) throw new GameError(GameErrorType.InvalidWord);
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
            while (checking.y - 1 >= 0 && tempBoard[checking.x][checking.y - 1].letter !== null) checking.y--;
            while (checking.y <= BOARD_HEIGHT && tempBoard[checking.x][checking.y].letter !== null) {
                wordPositions.push(new Vec2(checking.x, checking.y));
                word.push(tempBoard[checking.x][checking.y].letter as Letter);
                checking.y++;
            }
            if (word.length > 1) {
                // TODO Validate correctly with blanks
                if (this.dictionaryService.isWord(word)) throw new GameError(GameErrorType.InvalidWord);
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
            this.board[l.position.x][l.position.y].letter = l.letter;
            this.board[l.position.x][l.position.y].multiplier = null;
            this.players[player].easel.splice(this.players[player].easel.indexOf(l.letter), 1);
            this.players[player].easel.push(this.takeLetterFromPot());
        });
        let totalScoreForMove = 0;
        wordsPositions.forEach((w) => (totalScoreForMove += this.scoreWord(w)));
        this.players[player].score += totalScoreForMove;
        // prochain tour
        this.activePlayer = (this.activePlayer + 1) % this.players.length;
        if (this.gameStarting) this.gameStarting = false;
    }

    private checkMove(letters: Letter[], player: number): void {
        if (this.letterPot.length < AMT_OF_LETTERS_IN_EASEL) throw new GameError(GameErrorType.NotEnoughLetters);
        if (player !== this.activePlayer) throw new GameError(GameErrorType.WrongPlayer);
        const playerTempEasel = [...this.players[player].easel];
        letters.forEach((l) => {
            const index = playerTempEasel.indexOf(l);
            if (index === -1) {
                throw new GameError(GameErrorType.LettersAreNotInEasel);
            }
            playerTempEasel.splice(index, 1);
        });
    }

    private takeLetterFromPot(): Letter {
        return this.letterPot.splice(Math.round(Math.random() * this.letterPot.length), 1)[0];
    }

    private scoreWord(positions: Vec2[]): number {
        let score = 0;
        let multiplier = 1;
        positions.forEach((vec) => {
            const letter = this.board[vec.x][vec.y].letter;
            if (letter === null) throw new GameError(GameErrorType.LetterIsNull);
            const letterPoints = this.pointPerLetter.get(letter);
            if (letterPoints === undefined) throw new GameError(GameErrorType.UndefinedPoints);
            const multi = this.board[vec.x][vec.y].multiplier;
            if (multi !== null) {
                switch (multi.type) {
                    case MultiplierType.Letter:
                        score += letterPoints * multi.type === MultiplierType.Letter ? multi.amt : 1;
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
        return this.board[position.x][position.y].letter;
    }
}
