import { gameStatusReceived, resetAllState } from '@app/actions/game-status.actions';
import { exchangeLettersSuccess, placeWordSuccess } from '@app/actions/player.actions';
import { copyPlayer, Player } from '@app/classes/player';
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
        const nextState = { player: copyPlayer(state.player), opponent: copyPlayer(state.opponent) };
        nextState.player.removeLettersFromEasel(word.letters);

        if (newLetters) nextState.player.addLettersToEasel(newLetters);
        if (newScore) nextState.player.score = newScore;

        return nextState;
    }),

    on(exchangeLettersSuccess, (state, { oldLetters, newLetters }) => {
        const nextState = { player: copyPlayer(state.player), opponent: copyPlayer(state.opponent) };
        nextState.player.removeLettersFromEasel(oldLetters);
        nextState.player.addLettersToEasel(newLetters);

        return nextState;
    }),

    on(resetAllState, () => initialState),
);
