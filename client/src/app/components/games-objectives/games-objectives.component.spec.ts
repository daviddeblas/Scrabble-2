import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppMaterialModule } from '@app/modules/material.module';
import { GamesObjectivesComponent } from './games-objectives.component';

describe('GamesObjectivesComponent', () => {
    let component: GamesObjectivesComponent;
    let fixture: ComponentFixture<GamesObjectivesComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [GamesObjectivesComponent],
            imports: [AppMaterialModule, BrowserAnimationsModule],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(GamesObjectivesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
