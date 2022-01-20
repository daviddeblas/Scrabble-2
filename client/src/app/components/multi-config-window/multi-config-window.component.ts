import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';


@Component({
  selector: 'app-multi-config-window',
  templateUrl: './multi-config-window.component.html',
  styleUrls: ['./multi-config-window.component.scss']
})
export class MultiConfigWindowComponent implements OnInit {
  settingsForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
    selectedDictionnary: ['', Validators.required],
  });

  //private routeur: Router;
  dictionnaries : string[];
  timer : number;
  constructor(private fb: FormBuilder) {
    //this.dictionnaries = httpService.getDictionnaries();
    this.dictionnaries = ["Dictionnaire Français"];
    this.timer = 30;
   }

  ngOnInit(): void {
  }

  incrementTime() : void {
    if(this.timer < 300)
      this.timer += 30;
  }

  decrementTime() : void {
    if(this.timer > 30)
      this.timer -= 30;
  }

  onSubmit(){ 
    //alert("Entered Name : " + this.settingsForm.value.name);
  }
}
