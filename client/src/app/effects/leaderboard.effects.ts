/* eslint-disable no-invalid-this */
import { Injectable } from '@angular/core';
import { loadLeaderboard } from '@app/actions/leaderboard.actions';
import { LeaderboardService } from '@app/services/leaderboard.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';

@Injectable()
export class LeaderboardEffects {
    loadLeaderboard$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(loadLeaderboard),
                tap(() => {
                    this.leaderboardService.getLeaderboard();
                }),
            ),
        { dispatch: false },
    );

    constructor(private actions$: Actions, private leaderboardService: LeaderboardService) {}
}
