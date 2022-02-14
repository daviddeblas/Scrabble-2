import { Injectable } from '@angular/core';
import { syncBoard, syncBoardSuccess } from '@app/actions/board.actions';
import { receivedMessage } from '@app/actions/chat.actions';
import { exchangeLettersSuccess } from '@app/actions/player.actions';
import { Letter, stringToLetters } from '@app/classes/letter';
import { ASCII_ALPHABET_POSITION, BOARD_SIZE, POSITION_LAST_CHAR } from '@app/constants';
import { BoardState } from '@app/reducers/board.reducer';
import { Players } from '@app/reducers/player.reducer';
import { Store } from '@ngrx/store';
import { SocketClientService } from './socket-client.service';

const WORD_VALIDATION_DELAY = 3000;
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
        if (this.lettersInEasel(letters)) {
            const commandLine = 'échanger ' + letters;
            this.socketService.send('command', commandLine);
        }
    }

    placeWord(position: string, letters: string): void {
        const command = 'placer';
        if (!this.lettersInEasel(letters)) return;
        let boardPosition: string;
        let direction: string;
        if (/^[vh]$/.test(position.slice(POSITION_LAST_CHAR))) {
            boardPosition = position.slice(0, position.length - 1);
            direction = position.slice(POSITION_LAST_CHAR);
        } else {
            boardPosition = position;
            direction = '';
        }
        if (!this.wordPlacementCorrect(boardPosition, direction, letters)) {
            this.playerStore.dispatch(receivedMessage({ username: '', message: 'Erreur de syntaxe', errorName: 'Error' }));
            return;
        }
        this.setUpBoardWithWord(boardPosition, direction, letters);
        this.playerStore.dispatch(exchangeLettersSuccess({ oldLetters: stringToLetters(letters), newLetters: [] }));
        this.socketService.send('command', command + ' ' + position + ' ' + letters);
    }

    setUpBoardWithWord(position: string, direction: string, letters: string): void {
        this.socketService.on('error', () => {
            setTimeout(() => {
                this.boardStore.dispatch(syncBoard());
            }, WORD_VALIDATION_DELAY);
        });
        let board: (Letter | null)[][] = [];
        this.boardStore.select('board').subscribe((us) => (board = us.board));
        const word = stringToLetters(letters);
        const column = parseInt(position.slice(1, position.length), 10) - 1;
        const line = position.charCodeAt(0) - ASCII_ALPHABET_POSITION;
        const tempBoard = JSON.parse(JSON.stringify(board));
        const directionValue = direction === 'h' ? column : line;
        for (let i = directionValue; i < word.length + directionValue; ++i) {
            switch (direction) {
                case 'h':
                    tempBoard[line][i] = word[i - directionValue];
                    break;
                case 'v':
                    tempBoard[i][column] = word[i - directionValue];
                    break;
            }
        }
        this.boardStore.dispatch(syncBoardSuccess({ newBoard: tempBoard }));
    }

    lettersInEasel(letters: string): boolean {
        let playerEasel: Letter[] = [];
        this.playerStore.select('players').subscribe((us) => (playerEasel = us.player.easel));
        const easelLetters = JSON.parse(JSON.stringify(playerEasel));
        for (const letter of letters) {
            let letterExist = false;
            for (const element of easelLetters) {
                if (element.toString().toLowerCase() === letter || (element.toString() === '*' && letter === letter.toUpperCase())) {
                    easelLetters.splice(easelLetters.indexOf(element), 1);
                    letterExist = true;
                    break;
                }
            }
            if (!letterExist) {
                this.playerStore.dispatch(receivedMessage({ username: '', message: 'Erreur de syntaxe', errorName: 'Error' }));
                return false;
            }
        }
        return true;
    }

    wordPlacementCorrect(position: string, direction: string, letters: string): boolean {
        const column = parseInt(position.slice(1, position.length), 10) - 1;
        const line = position.charCodeAt(0) - ASCII_ALPHABET_POSITION;
        let isPlacable = false;
        let board: (Letter | null)[][] = [];
        this.boardStore.select('board').subscribe((us) => (board = us.board));
        for (let i = 0; i < letters.length; ++i) {
            if (direction === 'h') {
                isPlacable ||= this.checkNearSpaces(line, column + i, board);
            } else {
                isPlacable ||= this.checkNearSpaces(line + i, column, board);
            }
            const letterBoard = direction === 'h' ? board[line][column + i] : board[line + i][column];
            if (letterBoard !== null) {
                if (letterBoard.toString() !== letters[i].toUpperCase()) {
                    return false;
                } else {
                    isPlacable = true;
                }
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
        if (column < BOARD_SIZE - 1) isPlacable ||= board[line][column + 1] != null;
        if (line < BOARD_SIZE - 1) isPlacable ||= board[line + 1][column] != null;
        if (column > 0) isPlacable ||= board[line][column - 1] != null;
        if (line > 0) isPlacable ||= board[line - 1][column] != null;
        return isPlacable;
    }
}
