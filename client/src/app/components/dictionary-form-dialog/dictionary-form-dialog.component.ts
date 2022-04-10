import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-dictionary-form-dialog',
    templateUrl: './dictionary-form-dialog.component.html',
    styleUrls: ['./dictionary-form-dialog.component.scss'],
})
export class DictionaryFormDialogComponent implements OnInit {
    settingsForm: FormGroup;
    title: string;
    description: string;
    fileRequired: boolean;

    constructor(private fb: FormBuilder) {}

    ngOnInit(): void {
        this.settingsForm = this.fb.group({
            title: [this.title, [Validators.required]],
            description: [this.description, Validators.required],
            file: ['', this.fileRequired ? Validators.required : Validators.nullValidator],
        });
    }

    onSubmit() {}
}
