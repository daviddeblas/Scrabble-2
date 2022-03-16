import { HighScore } from '@app/classes/highscore';
import { createAction, props } from '@ngrx/store';

export const loadLeaderboard = createAction('[highScores] load higScores');

export const loadLeaderBoardSuccess = createAction('[highScores] load highScores Success', props<{ highScores: HighScore[] }>());

export const loadLeaderBoardSuccess = createAction('[highScores] load highScores Failure', props<{ error: Error }>());
