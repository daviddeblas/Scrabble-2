import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { resetGameHistory } from '@app/actions/game-history.actions';
import { BotAdminComponent } from '@app/components/bot-name-admin/bot-name-admin.component';
import { DictionariesAdministratorComponent } from '@app/components/dictionaries-administrator/dictionaries-administrator.component';
import { GameHistoryTableComponent } from '@app/components/game-history-table/game-history-table.component';
import { AppMaterialModule } from '@app/modules/material.module';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { cold } from 'jasmine-marbles';
import { AdminPageComponent } from './admin-page.component';

describe('AdminPageComponent', () => {
    let component: AdminPageComponent;
    let fixture: ComponentFixture<AdminPageComponent>;
    let store: MockStore;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AppMaterialModule, BrowserAnimationsModule],
            declarations: [AdminPageComponent, GameHistoryTableComponent, DictionariesAdministratorComponent, BotAdminComponent],
            providers: [
                provideMockStore({
                    selectors: [
                        {
                            selector: 'gameHistory',
                            value: { gameHistory: {} },
                        },
                    ],
                }),
            ],
        }).compileComponents();
        store = TestBed.inject(MockStore);
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AdminPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should dispatch resetGameHistory when resetGameHistory called', () => {
        component.resetGameHistory();
        const expectedAction = cold('a', { a: resetGameHistory() });
        expect(store.scannedActions$).toBeObservable(expectedAction);
    });
});
