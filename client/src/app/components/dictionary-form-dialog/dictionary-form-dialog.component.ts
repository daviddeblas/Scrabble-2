import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { addDictionary, modifyDictionary } from '@app/actions/dictionaries.actions';
import { Store } from '@ngrx/store';
import { Dictionary } from 'common/classes/dictionary';
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

    loadedDictionary: Dictionary | undefined;

    constructor(private fb: FormBuilder, private store: Store, private dialogRef: MatDialogRef<DictionaryFormDialogComponent>) {}

    ngOnInit(): void {
        this.settingsForm = this.fb.group({
            title: new FormControl({ value: this.currentDictionary?.title, disabled: this.fileRequired }, [Validators.required]),
            description: new FormControl({ value: this.currentDictionary?.description, disabled: this.fileRequired }, [Validators.required]),
            file: ['', this.fileRequired ? Validators.required : Validators.nullValidator],
        });
    }

    onFileSelected(event: Event) {
        // Ca au moins ca compile
        const file: File = (event as unknown as { target: { files: File[] } }).target.files[0];

        file.text().then((text) => {
            this.loadedDictionary = JSON.parse(text);
            if (this.loadedDictionary) {
                this.settingsForm.controls.title.setValue(this.loadedDictionary.title);
                this.settingsForm.controls.description.setValue(this.loadedDictionary.description);
            }
            this.settingsForm.controls.title.enable();
            this.settingsForm.controls.description.enable();
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
        } else if (this.loadedDictionary) {
            const formDictionary = this.getFormDictionary();
            this.loadedDictionary.title = formDictionary.title;
            this.loadedDictionary.description = formDictionary.description;
            this.store.dispatch(addDictionary({ dictionary: this.loadedDictionary }));
        }

        this.dialogRef.close();
    }

    private getFormDictionary(): iDictionary {
        return { title: this.settingsForm.controls.title.value, description: this.settingsForm.controls.description.value };
    }
}
