import { ComponentFixture, TestBed } from '@angular/core/testing';
import { zoomIn, zoomOut } from '@app/actions/local-settings.actions';
import { Store } from '@ngrx/store';
import { SidebarComponent } from './sidebar.component';

describe('SidebarComponent', () => {
    let component: SidebarComponent;
    let fixture: ComponentFixture<SidebarComponent>;
    let store: jasmine.SpyObj<Store>;

    beforeEach(async () => {
        store = jasmine.createSpyObj<Store>('store', ['dispatch', 'select']);

        await TestBed.configureTestingModule({
            declarations: [SidebarComponent],
            providers: [
                {
                    provide: Store,
                    useValue: store,
                },
            ],
        }).compileComponents();
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
        component.zoomIn();
        expect(store.dispatch).toHaveBeenCalledWith(zoomIn());
    });

    it('should dispatch "[LocalSettings] Zoom Out"', () => {
        component.zoomOut();
        expect(store.dispatch).toHaveBeenCalledWith(zoomOut());
    });
});
