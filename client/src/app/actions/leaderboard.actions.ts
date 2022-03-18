import { HighScore } from '@app/classes/highscore';
import { createAction, props } from '@ngrx/store';

export const loadLeaderboard = createAction('[HighScores] load higScores');

export const loadClassicLeaderboardSuccess = createAction('[HighScores] Load Classic HighScores Success', props<{ highScores: HighScore[] }>());

export const loadLog2990LeaderboardSuccess = createAction('[HighScores] Load Log2990 HighScores Success', props<{ highScores: HighScore[] }>());
