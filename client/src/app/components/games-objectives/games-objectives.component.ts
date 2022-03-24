import { Component } from '@angular/core';
import { Log2990Objective } from 'common/interfaces/log2990-objectives';

@Component({
    selector: 'app-games-objectives',
    templateUrl: './games-objectives.component.html',
    styleUrls: ['./games-objectives.component.scss'],
})
export class GamesObjectivesComponent {
    publicObjectives: Log2990Objective[];
    privateObjective: Log2990Objective;
    isChecked: boolean = true;

    // constructor() {}

    // ngOnInit(): void {}

    notClickable(event: MouseEvent) {
        event.preventDefault();
    }
}
