import { Injectable } from '@angular/core';
import { syncBoard, syncBoardSuccess } from '@app/actions/board.actions';
import { Letter, stringToLetters } from '@app/classes/letter';
import { ASCII_ALPHABET_POSITION, POSITION_LAST_CHAR } from '@app/constants';
import { BoardState } from '@app/reducers/board.reducer';
import { Store } from '@ngrx/store';
import { take } from 'rxjs/operators';
import { SocketClientService } from './socket-client.service';

const WORD_VALIDATION_DELAY = 3000;
@Injectable({
    providedIn: 'root',
})
export class PlayerService {
    constructor(
        private socketService: SocketClientService,
        // private playerStore: Store<{ players: Players }>,
        private boardStore: Store<{ board: BoardState }>,
    ) {}

    surrenderGame(): void {
        this.socketService.send('surrender game');
    }

    placeWord(position: string, letters: string): void {
        const command = 'placer';
        // if (!this.lettersInEasel(letters)) return;
        let boardPosition: string;
        let direction: string;
        if (/^[vh]$/.test(position.slice(POSITION_LAST_CHAR))) {
            boardPosition = position.slice(0, position.length - 1);
            direction = position.slice(POSITION_LAST_CHAR);
        } else {
            boardPosition = position;
            direction = '';
        }
        // if (!this.wordPlacementCorrect(boardPosition, direction, letters)) return;
        this.setUpBoardWithWord(boardPosition, direction, letters);
        this.socketService.send('command', command + ' ' + position + ' ' + letters);
    }

    setUpBoardWithWord(position: string, direction: string, letters: string) {
        this.socketService.on('error', () => {
            setTimeout(() => {
                this.boardStore.dispatch(syncBoard());
            }, WORD_VALIDATION_DELAY);
        });
        let board: Letter[][] = [];
        this.boardStore.pipe(take(1)).subscribe((us) => (board = us.board.board));
        const word = stringToLetters(letters);
        const column = parseInt(position.slice(1, position.length), 10);
        const line = position.charCodeAt(0) - ASCII_ALPHABET_POSITION;
        const tempBoard = JSON.parse(JSON.stringify(board));
        const directionValue = direction === 'h' ? column : line;
        for (let i = directionValue; i < word.length + directionValue; ++i) {
            switch (direction) {
                case 'h':
                    tempBoard[column + i][line] = word[i - directionValue];
                    break;
                case 'v':
                    tempBoard[column][line + i] = word[i - directionValue];
                    break;
            }
        }
        this.boardStore.dispatch(syncBoardSuccess({ newBoard: tempBoard }));
    }

    /* private lettersInEasel(letters: string): boolean {
        let easelLetters: Letter[] = [];
        this.playerStore.pipe(take(1)).subscribe((us) => (easelLetters = us.players.player.easel));
        for (const letter of letters) {
            let letterExist = false;
            for (const element of easelLetters) {
                if (element.toString().toLowerCase() === letter || (element.toString() === '*' && letter === letter.toUpperCase())) {
                    easelLetters.slice(easelLetters.indexOf(element), 1);
                    letterExist = true;
                    break;
                }
            }
            if (!letterExist) {
                this.playerStore.dispatch(receivedMessage({ username: 'Error', message: 'Erreur de syntaxe' }));
                return false;
            }
        }
        return true;
    }

    private wordPlacementCorrect(position: string, direction: string, letters: string): boolean {
        const column = parseInt(position.slice(1, position.length), 10);
        const line = position.charCodeAt(0) - ASCII_ALPHABET_POSITION;

        let isPlacable = false;
        for (let i = direction === 'h' ? column : line; i < letters.length; ++i) {
            switch (direction) {
                case Direction.HORIZONTAL:
                    isPlacable ||= this.checkNearSpaces(column + i, line, stringToLetter(letters[i]));
                    break;
                case Direction.VERTICAL:
                    isPlacable ||= this.checkNearSpaces(column, line + i, stringToLetter(letters[i]));
                    break;
            }
            if (isPlacable) break;
        }
        return isPlacable;
    }

    private checkNearSpaces(column: number, line: number, letterPlaced: Letter): boolean {
        let board: Letter[][] = [];
        this.boardStore.pipe(take(1)).subscribe((us) => (board = us.board.board));
        let isPlacable = false;
        isPlacable ||= board[column][line] === letterPlaced;
        isPlacable ||= board[column + 1][line] != null;
        isPlacable ||= board[column][line + 1] != null;
        isPlacable ||= board[column - 1][line] != null;
        isPlacable ||= board[column][line - 1] != null;
        return isPlacable;
    }*/
}
