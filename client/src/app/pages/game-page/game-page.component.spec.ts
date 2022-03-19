import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { browserReload } from '@app/actions/browser.actions';
import { AppMaterialModule } from '@app/modules/material.module';
import { EffectsRootModule } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { cold } from 'jasmine-marbles';
import { Observable } from 'rxjs';
import { GamePageComponent } from './game-page.component';

describe('GamePageComponent', () => {
    let component: GamePageComponent;
    let fixture: ComponentFixture<GamePageComponent>;
    let actions$: Observable<unknown>;
    let store: MockStore;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [BrowserAnimationsModule, AppMaterialModule],
            providers: [
                {
                    provide: Router,
                    useValue: jasmine.createSpyObj('router', ['navigateToUrl']),
                },
                provideMockActions(() => actions$),
                {
                    provide: EffectsRootModule,
                    useValue: {
                        addEffects: jasmine.createSpy('addEffects'),
                    },
                },
                provideMockStore(),
            ],
        }).compileComponents();
        store = TestBed.inject(MockStore);
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(GamePageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should dispatch browserReload when window reload', () => {
        component.catchBrowserLoad(new Event('load'));

        const expectedAction = cold('a', { a: browserReload() });

        expect(store.scannedActions$).toBeObservable(expectedAction);
    });
});
