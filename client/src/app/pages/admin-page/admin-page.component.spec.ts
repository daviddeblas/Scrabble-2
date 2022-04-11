import { ComponentFixture, TestBed } from '@angular/core/testing';
import { resetGameHistory } from '@app/actions/game-history.actions';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { cold } from 'jasmine-marbles';
import { AdminPageComponent } from './admin-page.component';

describe('AdminPageComponent', () => {
    let component: AdminPageComponent;
    let fixture: ComponentFixture<AdminPageComponent>;
    let store: MockStore;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AdminPageComponent],
            providers: [provideMockStore()],
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
