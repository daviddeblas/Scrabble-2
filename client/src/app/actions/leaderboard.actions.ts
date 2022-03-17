import { HighScore } from '@app/classes/highscore';
import { createAction, props } from '@ngrx/store';

export const loadLeaderboard = createAction('[highScores] load higScores');

export const loadLeaderboardSuccess = createAction('[highScores] load highScores Success', props<{ highScores: HighScore[] }>());

export const loadLeaderboardFailure = createAction('[highScores] load highScores Failure', props<{ error: Error }>());
