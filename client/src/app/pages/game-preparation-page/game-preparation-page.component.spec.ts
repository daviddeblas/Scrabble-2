import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MultiConfigWindowComponent } from '@app/components/multi-config-window/multi-config-window.component';
import { WaitingRoomComponent } from '@app/components/waiting-room/waiting-room.component';
import { AppMaterialModule } from '@app/modules/material.module';
import { GamePreparationPageComponent } from './game-preparation-page.component';

describe('GamePreparationPageComponent', () => {
    let component: GamePreparationPageComponent;
    let fixture: ComponentFixture<GamePreparationPageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [GamePreparationPageComponent, MultiConfigWindowComponent, WaitingRoomComponent],
            imports: [AppMaterialModule, BrowserAnimationsModule],
            providers: [
                FormBuilder,
                {
                    provide: MatDialogRef,
                    useValue: {},
                },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(GamePreparationPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
