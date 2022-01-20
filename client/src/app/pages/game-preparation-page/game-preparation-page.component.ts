import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { MultiConfigWindowComponent } from '@app/components/multi-config-window/multi-config-window.component';
import { WaitingRoomComponent } from '@app/components/waiting-room/waiting-room.component';

@Component({
  selector: 'app-game-preparation-page',
  templateUrl: './game-preparation-page.component.html',
  styleUrls: ['./game-preparation-page.component.scss']
})
export class GamePreparationPageComponent implements OnInit {
  @ViewChild('stepper') private stepper: MatStepper;
  @ViewChild('MultiConfigWindowComponent') multiConfigWindowComponent: MultiConfigWindowComponent;
  @ViewChild('WaitingRoomComponent') waitingRoomComponent: WaitingRoomComponent;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  isEditable = false;
  constructor(private _formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required],
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required],
    });
  }
  get formSettings(){
    return this.multiConfigWindowComponent ? this.multiConfigWindowComponent.settingsForm : this.firstFormGroup;
  }
  previousStep(): void {
    console.log(this.stepper);
    this.stepper.selectedIndex = 0;
    
  }

}
