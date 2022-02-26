import { ComponentFixture, TestBed } from '@angular/core/testing';
import { zoomIn, zoomOut } from '@app/actions/local-settings.actions';
import { Player } from '@app/classes/player';
import { AppMaterialModule } from '@app/modules/material.module';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { cold } from 'jasmine-marbles';
import { SidebarComponent } from './sidebar.component';

describe('SidebarComponent', () => {
    let component: SidebarComponent;
    let fixture: ComponentFixture<SidebarComponent>;
    let store: MockStore;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AppMaterialModule],
            declarations: [SidebarComponent],
            providers: [provideMockStore()],
        }).compileComponents();

        store = TestBed.inject(MockStore);
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SidebarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should dispatch "[LocalSettings] Zoom In"', () => {
        const expectedAction = cold('a', { a: zoomIn() });
        component.zoomIn();
        expect(store.scannedActions$).toBeObservable(expectedAction);
        fixture.destroy();
    });

    it('should dispatch "[LocalSettings] Zoom Out"', () => {
        const expectedAction = cold('a', { a: zoomOut() });
        component.zoomOut();
        expect(store.scannedActions$).toBeObservable(expectedAction);
        fixture.destroy();
    });

    it('should return false when undefined player', () => {
        component.activePlayer = 'John';
        expect(component.isActivePlayer(undefined)).toBeFalse();
        fixture.destroy();
    });

    it('should return true when player is active ', () => {
        component.activePlayer = 'John';
        const player = new Player('John');
        expect(component.isActivePlayer(player)).toBeTrue();
        fixture.destroy();
    });

    it('should return false when player is not active ', () => {
        component.activePlayer = 'Smith';
        const player = new Player('John');
        expect(component.isActivePlayer(player)).toBeFalse();
        fixture.destroy();
    });

    it('should return time from countdown', () => {
        component.countdown = 83;
        expect(component.timerToString()).toBe('1:23');
        fixture.destroy();
    });

    it('should decrement a second from countdown', () => {
        const expected = 6;
        component.countdown = 7;
        component.decrementCountdown()();
        expect(component.countdown).toBe(expected);
        fixture.destroy();
    });

    it('should not be negative', () => {
        component.countdown = 0;
        component.decrementCountdown()();
        expect(component.countdown).toBe(0);
        fixture.destroy();
    });
});
