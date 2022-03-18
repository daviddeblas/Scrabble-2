import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppMaterialModule } from '@app/modules/material.module';
import { LeaderBoardScores } from '@app/reducers/leaderboard.reducer';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { LeaderboardPageComponent } from './leaderboard-page.component';

describe('LeaderboardPageComponent', () => {
    let component: LeaderboardPageComponent;
    let fixture: ComponentFixture<LeaderboardPageComponent>;
    let store: MockStore;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [LeaderboardPageComponent],
            imports: [AppMaterialModule],
            providers: [provideMockStore()],
        }).compileComponents();
        store = TestBed.inject(MockStore);
        store.overrideSelector('highScores', [] as unknown as LeaderBoardScores);
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(LeaderboardPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
