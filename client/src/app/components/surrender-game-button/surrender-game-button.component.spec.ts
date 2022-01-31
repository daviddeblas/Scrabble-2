import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppMaterialModule } from '@app/modules/material.module';
import { SurrenderGameButtonComponent } from './surrender-game-button.component';

describe('SurrenderGameComponent', () => {
    let component: SurrenderGameButtonComponent;
    let fixture: ComponentFixture<SurrenderGameButtonComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SurrenderGameButtonComponent],
            imports: [AppMaterialModule],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SurrenderGameButtonComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
