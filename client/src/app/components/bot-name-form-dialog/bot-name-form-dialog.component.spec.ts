import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppMaterialModule } from '@app/modules/material.module';
import { provideMockStore } from '@ngrx/store/testing';
import { BotNameFormDialogComponent } from './bot-name-form-dialog.component';

describe('BotNameFormDialogComponent', () => {
    let component: BotNameFormDialogComponent;
    let fixture: ComponentFixture<BotNameFormDialogComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AppMaterialModule, BrowserAnimationsModule],
            declarations: [BotNameFormDialogComponent],
            providers: [
                FormBuilder,
                provideMockStore(),
                {
                    provide: MatDialogRef,
                    useValue: {},
                },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(BotNameFormDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
