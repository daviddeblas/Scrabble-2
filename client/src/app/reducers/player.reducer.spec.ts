import { gameStatusReceived } from '@app/actions/game-status.actions';
import { exchangeLettersSuccess, placeWordSuccess } from '@app/actions/player.actions';
import { Letter } from '@app/classes/letter';
import { Player } from '@app/classes/player';
import { Direction, Word } from '@app/classes/word';
import { BoardState } from './board.reducer';
import { GameStatus } from './game-status.reducer';
import { initialState, Players, reducer } from './player.reducer';

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
function createInitialPlayersState() {
    const players: Players = {
        player: new Player('Player 1'),
        opponent: new Player('Player 2'),
    };

    players.player.easel = ['A', 'S', 'S', 'L', 'L', 'P', 'O'];
    players.player.score = 0;

    return players;
}

describe('[Players] Reducer', () => {
    describe('[Players] Load Players', () => {
        const playersStub: Players = {
            player: new Player('Player 1'),
            opponent: new Player('Player 2'),
        };

        const gameStatusStub: GameStatus = {
            activePlayer: '',
            letterPotLength: 0,
        };

        const boardState: BoardState = {
            board: [],
            multipliers: [],
            pointsPerLetter: [],
        };

        it('should return the loaded players', () => {
            const action = gameStatusReceived({
                status: gameStatusStub,
                players: playersStub,
                board: boardState,
            });

            const result = reducer(initialState, action);

            expect(result).toBe(playersStub);
        });
    });

    describe('[Players] Place Word Success', () => {
        const word = new Word(['A', 'L', 'L', 'O'], { x: 0, y: 0 }, Direction.VERTICAL);

        it('should remove used letters and add new letters to easel', () => {
            const initialPlayers: Players = createInitialPlayersState();
            const newLetters: Letter[] = ['G', 'H', 'B', 'L'];
            const action = placeWordSuccess({ word, newLetters });

            const result = reducer(initialPlayers, action);

            const expectedResult = createInitialPlayersState();
            expectedResult.player.removeLettersFromEasel(word.letters);
            expectedResult.player.addLettersToEasel(newLetters);

            expect(result).toEqual(expectedResult);
        });

        it('should set the new score', () => {
            const initialPlayers: Players = createInitialPlayersState();
            const newScore = 100;
            const action = placeWordSuccess({ word, newScore });

            const result = reducer(initialPlayers, action);

            const expectedResult = createInitialPlayersState();
            expectedResult.player.removeLettersFromEasel(word.letters);
            expectedResult.player.score = newScore;

            expect(result).toEqual(expectedResult);
        });
    });

    describe('[Players] Exchange Letters Success', () => {
        it('should exchange the chosen letters', () => {
            const lettersToExchange: Letter[] = ['P', 'S'];
            const newLetters: Letter[] = ['A', 'E'];

            const initialPlayers: Players = createInitialPlayersState();
            const action = exchangeLettersSuccess({ oldLetters: lettersToExchange, newLetters });

            const result = reducer(initialPlayers, action);

            const expectedResult = createInitialPlayersState();
            expectedResult.player.removeLettersFromEasel(lettersToExchange);
            expectedResult.player.addLettersToEasel(newLetters);

            expect(result).toEqual(expectedResult);
        });
    });
});
