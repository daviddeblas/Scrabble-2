import { Injectable } from '@angular/core';
import { receivedMessage } from '@app/actions/chat.actions';
import { placeWordSuccess } from '@app/actions/player.actions';
import { Direction, Word } from '@app/classes/word';
import { BoardState } from '@app/reducers/board.reducer';
import { Players } from '@app/reducers/player.reducer';
import { Store } from '@ngrx/store';
import { Letter } from 'common/classes/letter';
import { boardPositionToVec2 } from 'common/classes/vec2';
import { ASCII_ALPHABET_POSITION, BOARD_SIZE, DECIMAL_BASE, POSITION_LAST_CHAR } from 'common/constants';
import { SocketClientService } from './socket-client.service';

@Injectable({
    providedIn: 'root',
})
export class PlayerService {
    constructor(
        private socketService: SocketClientService,
        private playerStore: Store<{ players: Players }>,
        private boardStore: Store<{ board: BoardState }>,
    ) {}

    surrenderGame(): void {
        this.socketService.send('surrender game');
    }

    exchangeLetters(letters: string): void {
        if (!this.lettersInEasel(letters)) return;
        const commandLine = 'échanger ' + letters;
        this.socketService.send('command', commandLine);
    }

    placeWord(position: string, letters: string): void {
        const command = 'placer';
        let lettersToPlace = '';
        let column = parseInt((position.match(/\d+/) as RegExpMatchArray)[0], DECIMAL_BASE) - 1;
        let line = position.charCodeAt(0) - ASCII_ALPHABET_POSITION;
        if (!this.lettersInEasel(letters)) return;
        let letterPlaced = 0;
        if (letters.length > 1) {
            while (letterPlaced < letters.length) {
                if (column >= BOARD_SIZE || line >= BOARD_SIZE) {
                    this.playerStore.dispatch(
                        receivedMessage({ username: '', message: 'Erreur de syntaxe: le mot ne rentre pas dans plateau', messageType: 'Error' }),
                    );
                    return;
                }
                const letter = this.letterOnBoard(column, line);
                if (letter) {
                    lettersToPlace += letter;
                } else {
                    lettersToPlace += letters[letterPlaced];
                    letterPlaced++;
                }
                if (position.slice(POSITION_LAST_CHAR) === 'h') {
                    column += 1;
                } else {
                    line += 1;
                }
            }
        } else {
            lettersToPlace = letters;
        }
        let boardPosition: string;
        let direction: string;
        if (/^[vh]$/.test(position.slice(POSITION_LAST_CHAR))) {
            boardPosition = position.slice(0, position.length - 1);
            direction = position.slice(POSITION_LAST_CHAR);
        } else {
            boardPosition = position;
            direction = 'h';
        }
        if (!this.wordPlacementCorrect(boardPosition, direction, lettersToPlace)) {
            this.playerStore.dispatch(
                receivedMessage({ username: '', message: 'Erreur de syntaxe: commande placer mal formée', messageType: 'Error' }),
            );
            return;
        }
        const tempWordPlaced = new Word(
            lettersToPlace,
            boardPositionToVec2(boardPosition),
            direction === 'h' ? Direction.HORIZONTAL : Direction.VERTICAL,
        );
        this.boardStore.dispatch(placeWordSuccess({ word: tempWordPlaced }));
        this.socketService.send('command', command + ' ' + position + ' ' + letters);
    }

    lettersInEasel(letters: string): boolean {
        let playerEasel: Letter[] = [];
        this.playerStore.select('players').subscribe((us) => (playerEasel = us.player.easel));
        const easelLetters = JSON.parse(JSON.stringify(playerEasel));
        for (const letter of letters) {
            let letterExist = false;
            for (const element of easelLetters) {
                const equalLetter = element.toString().toLowerCase() === letter;
                const isBlankLetter = element.toString() === '*' && letter === letter.toUpperCase();
                if (equalLetter || isBlankLetter) {
                    easelLetters.splice(easelLetters.indexOf(element), 1);
                    letterExist = true;
                    break;
                }
            }
            if (!letterExist) {
                this.playerStore.dispatch(
                    receivedMessage({ username: '', message: 'Erreur de syntaxe: le chevalet ne contient pas ces lettres', messageType: 'Error' }),
                );
                return false;
            }
        }
        return true;
    }

    letterOnBoard(column: number, line: number): string | undefined {
        let board: (Letter | null)[][] = [];
        this.boardStore.select('board').subscribe((us) => (board = us.board));
        return board[column][line]?.toString().toLowerCase();
    }

    wordPlacementCorrect(position: string, direction: string, letters: string): boolean {
        const column = parseInt(position.slice(1, position.length), DECIMAL_BASE) - 1;
        const line = position.charCodeAt(0) - ASCII_ALPHABET_POSITION;
        let isPlacable = false;
        let board: (Letter | null)[][] = [];
        this.boardStore.select('board').subscribe((us) => (board = us.board));
        for (let i = 0; i < letters.length; ++i) {
            if (direction === 'h') {
                isPlacable ||= this.checkNearSpaces(column + i, line, board);
            } else {
                isPlacable ||= this.checkNearSpaces(column, line + i, board);
            }
            const letterBoard = direction === 'h' ? board[column + i][line] : board[column][line + i];
            if (letterBoard === null) continue;

            if (letterBoard.toString() !== letters[i].toUpperCase()) {
                return false;
            } else {
                isPlacable = true;
            }
        }
        return isPlacable;
    }

    private checkNearSpaces(column: number, line: number, board: (Letter | null)[][]): boolean {
        let isPlacable = false;
        const center = 7;
        if (board[center][center] === null) {
            return column === center && line === center;
        }
        if (column < BOARD_SIZE - 1) isPlacable ||= board[column + 1][line] != null;
        if (line < BOARD_SIZE - 1) isPlacable ||= board[column][line + 1] != null;
        if (column > 0) isPlacable ||= board[column - 1][line] != null;
        if (line > 0) isPlacable ||= board[column][line - 1] != null;
        return isPlacable;
    }
}
