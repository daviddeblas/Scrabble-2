import { resetAllState } from '@app/actions/game-status.actions';
import * as leaderboardActions from '@app/actions/leaderboard.actions';
import { createReducer, on } from '@ngrx/store';

export const leaderboardFeatureKey = 'highScores';

export const initialState: number[] = [];

export const reducer = createReducer(
    initialState,
    on(leaderboardActions.loadLeaderboardSuccess, (state, { highScores }) => highScores),
    on(resetAllState, () => initialState),
);
