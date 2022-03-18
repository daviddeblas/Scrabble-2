import { resetAllState } from '@app/actions/game-status.actions';
import * as leaderboardActions from '@app/actions/leaderboard.actions';
import { HighScore } from '@app/classes/highscore';
import { createReducer, on } from '@ngrx/store';

export interface LeaderBoardScores {
    classicHighScores: HighScore[];
    log2990HighScores: HighScore[];
}

export const leaderboardFeatureKey = 'highScores';

export const initialState: HighScore[] = [];

export const reducer = createReducer(
    initialState,
    on(leaderboardActions.loadClassicLeaderboardSuccess, (state, { highScores }) => ({ ...state, classicHighScores: highScores })),
    on(leaderboardActions.loadLog2990LeaderboardSuccess, (state, { highScores }) => ({ ...state, log2990HighScores: highScores })),
    on(resetAllState, () => initialState),
);
