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
    });

    it('should dispatch "[LocalSettings] Zoom Out"', () => {
        const expectedAction = cold('a', { a: zoomOut() });
        component.zoomOut();
        expect(store.scannedActions$).toBeObservable(expectedAction);
    });

    it('should return false when undefined player', () => {
        component.activePlayer = 'John';
        expect(component.isActivePlayer(undefined)).toBeFalse();
    });

    it('should return true when player is active ', () => {
        component.activePlayer = 'John';
        const player = new Player('John');
        expect(component.isActivePlayer(player)).toBeTrue();
    });

    it('should return false when player is not active ', () => {
        component.activePlayer = 'Smith';
        const player = new Player('John');
        expect(component.isActivePlayer(player)).toBeFalse();
    });
});
