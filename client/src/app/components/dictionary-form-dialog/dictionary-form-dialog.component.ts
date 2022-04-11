import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { addDictionary, modifyDictionary } from '@app/actions/dictionaries.actions';
import { Store } from '@ngrx/store';
import { iDictionary } from 'common/interfaces/dictionary';

@Component({
    selector: 'app-dictionary-form-dialog',
    templateUrl: './dictionary-form-dialog.component.html',
    styleUrls: ['./dictionary-form-dialog.component.scss'],
})
export class DictionaryFormDialogComponent implements OnInit {
    settingsForm: FormGroup;
    dictionaryIndex: number | null = null;
    currentDictionary: iDictionary | null = null;
    fileRequired: boolean = false;

    file: File;

    constructor(private fb: FormBuilder, private store: Store, private dialogRef: MatDialogRef<DictionaryFormDialogComponent>) {}

    ngOnInit(): void {
        this.settingsForm = this.fb.group({
            title: [this.currentDictionary?.title, [Validators.required]],
            description: [this.currentDictionary?.description, Validators.required],
            file: ['', this.fileRequired ? Validators.required : Validators.nullValidator],
        });
    }

    onSubmit() {
        if (this.dictionaryIndex !== null && this.currentDictionary != null) {
            this.store.dispatch(
                modifyDictionary({
                    oldDictionary: this.currentDictionary,
                    newDictionary: this.getFormDictionary(),
                }),
            );
        } else this.store.dispatch(addDictionary({ dictionary: this.getFormDictionary(), file: this.file }));

        this.dialogRef.close();
    }

    private getFormDictionary(): iDictionary {
        return { title: this.settingsForm.controls.title.value, description: this.settingsForm.controls.description.value };
    }
}
