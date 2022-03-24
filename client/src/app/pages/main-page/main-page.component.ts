import { Component, OnInit } from '@angular/core';
import { ObjectiveManagerService } from '@app/services/objective-manager.service';

@Component({
    selector: 'app-main-page',
    templateUrl: './main-page.component.html',
    styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent implements OnInit {
    mode2990Chosen: boolean = false;

    constructor(private objectiveService: ObjectiveManagerService) {}

    ngOnInit() {
        this.objectiveService.mode.subscribe((message) => (this.mode2990Chosen = message));
    }

    chooseMode2990() {
        this.mode2990Chosen = true;
        this.objectiveService.nextMessage(this.mode2990Chosen);
    }
}
