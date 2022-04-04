import { ComponentFixture, TestBed } from '@angular/core/testing';
import { loadGameHistory } from '@app/actions/game-history.actions';
import { AppMaterialModule } from '@app/modules/material.module';
import { GameHistoryInterface } from '@app/reducers/game-history.reducer';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { cold } from 'jasmine-marbles';
import { GameHistoryTableComponent } from './game-history-table.component';

describe('GameHistoryTableComponent', () => {
    let component: GameHistoryTableComponent;
    let fixture: ComponentFixture<GameHistoryTableComponent>;
    let store: MockStore;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [GameHistoryTableComponent],
            imports: [AppMaterialModule],
            providers: [provideMockStore()],
        }).compileComponents();
        store = TestBed.inject(MockStore);
        store.overrideSelector('gameHistory', {} as unknown as GameHistoryInterface);
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(GameHistoryTableComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should dispatch loadLeaderboard when created', () => {
        const expectedAction = cold('a', { a: loadGameHistory() });
        expect(store.scannedActions$).toBeObservable(expectedAction);
    });
});
