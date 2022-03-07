import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MultiConfigWindowComponent } from '@app/components/multi-config-window/multi-config-window.component';

@Component({
    selector: 'app-game-preparation-page',
    templateUrl: './game-preparation-page.component.html',
    styleUrls: ['./game-preparation-page.component.scss'],
})
export class GamePreparationPageComponent implements OnInit {
    @ViewChild('MultiConfigWindowComponent') private multiConfigWindowComponent: MultiConfigWindowComponent;
    firstFormGroup: FormGroup;
    isEditable: boolean;
    constructor(private formBuilder: FormBuilder) {
        this.isEditable = false;
    }

    ngOnInit(): void {
        this.firstFormGroup = this.formBuilder.group({
            firstCtrl: ['', Validators.required],
        });
    }
    get formSettings(): FormGroup {
        return this.multiConfigWindowComponent ? this.multiConfigWindowComponent.settingsForm : this.firstFormGroup;
    }
}
