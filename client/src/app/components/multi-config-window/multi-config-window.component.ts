import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-multi-config-window',
    templateUrl: './multi-config-window.component.html',
    styleUrls: ['./multi-config-window.component.scss'],
})
export class MultiConfigWindowComponent implements OnInit {
    private maxTime: number = 300;
    private minTime: number = 30;
    settingsForm: FormGroup;

    dictionaries: string[];
    timer: number;

    constructor(private fb: FormBuilder) {
        //this.dictionaries = httpService.getDictionaries();
        this.dictionaries = ['Dictionnaire Français'];
        this.timer = 60;
    }

    ngOnInit(): void {
        this.settingsForm = this.fb.group({
            name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
            selectedDictionary: ['', Validators.required],
        });
    }

    incrementTime(): void {
        if (this.timer < this.maxTime) this.timer += 30;
    }

    decrementTime(): void {
        if (this.timer > this.minTime) this.timer -= 30;
    }

    onSubmit() {
        //alert("Entered Name : " + this.settingsForm.value.name);
    }
}
