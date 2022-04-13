import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { addBotName, modifyBotName } from '@app/actions/bot-names.actions';
import { MAX_NAME_LENGTH, MIN_NAME_LENGTH } from '@app/constants';
import { Store } from '@ngrx/store';

@Component({
    selector: 'app-bot-name-form-dialog',
    templateUrl: './bot-name-form-dialog.component.html',
    styleUrls: ['./bot-name-form-dialog.component.scss'],
})
export class BotNameFormDialogComponent implements OnInit {
    currentBotName: string;
    currentDifficulty: string;
    oldName: string | undefined;
    settingsForm: FormGroup;
    constructor(private fb: FormBuilder, private store: Store, private dialogRef: MatDialogRef<BotNameFormDialogComponent>) {}

    ngOnInit(): void {
        this.settingsForm = this.fb.group({
            name: [this.currentBotName, [Validators.required, Validators.minLength(MIN_NAME_LENGTH), Validators.maxLength(MAX_NAME_LENGTH)]],
            difficulty: [
                { value: this.currentDifficulty, disabled: this.oldName !== undefined },
                this.oldName ? Validators.nullValidator : Validators.required,
            ],
        });
    }

    onSubmit(): void {
        if (!this.oldName)
            this.store.dispatch(addBotName({ name: this.settingsForm.controls.name.value, difficulty: this.settingsForm.controls.difficulty.value }));
        else
            this.store.dispatch(
                modifyBotName({ oldName: this.oldName, newName: this.settingsForm.controls.name.value, difficulty: this.currentDifficulty }),
            );
        this.dialogRef.close();
    }
}
