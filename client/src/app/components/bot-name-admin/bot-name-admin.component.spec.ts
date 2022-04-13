import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { BotNameFormDialogComponent } from '@app/components/bot-name-form-dialog/bot-name-form-dialog.component';
import { AppMaterialModule } from '@app/modules/material.module';
import { provideMockStore } from '@ngrx/store/testing';
import { BotAdminComponent } from './bot-name-admin.component';

describe('DictionariesAdministratorComponent', () => {
    let component: BotAdminComponent;
    let fixture: ComponentFixture<BotAdminComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AppMaterialModule],
            declarations: [BotAdminComponent, BotNameFormDialogComponent],
            providers: [
                provideMockStore(),
                {
                    provide: MatDialogRef,
                    useValue: {},
                },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(BotAdminComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
