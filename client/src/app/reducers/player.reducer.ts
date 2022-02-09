import { gameStatusReceived } from '@app/actions/game-status.actions';
import { exchangeLettersSuccess, placeWordSuccess } from '@app/actions/player.actions';
import { Player } from '@app/classes/player';
import { createReducer, on } from '@ngrx/store';

export const playerFeatureKey = 'players';

export interface Players {
    player: Player;
    opponent: Player;
}

export const initialState: Players = {
    player: new Player(''),
    opponent: new Player(''),
};

export const reducer = createReducer(
    initialState,

    on(gameStatusReceived, (state, { players }) => players),

    on(placeWordSuccess, (state, { word, newLetters, newScore }) => {
        state.player.removeLettersFromEasel(word.letters);

        if (newLetters) state.player.addLettersToEasel(newLetters);
        if (newScore) state.player.score = newScore;

        return state;
    }),

    on(exchangeLettersSuccess, (state, { oldLetters, newLetters }) => {
        state.player.removeLettersFromEasel(oldLetters);
        state.player.addLettersToEasel(newLetters);

        return state;
    }),
);
