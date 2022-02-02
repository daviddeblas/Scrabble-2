import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { loadRooms } from '@app/actions/room.actions';
import { RoomInfo } from '@app/classes/room-info';
import { RoomState } from '@app/reducers/room.reducer';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-game-join-page',
    templateUrl: './game-join-page.component.html',
    styleUrls: ['./game-join-page.component.scss'],
})
export class GameJoinPageComponent implements OnInit {
    formGroup: FormGroup;
    hosts$: Observable<RoomInfo[]>;

    constructor(formBuilder: FormBuilder, roomStore: Store<{ room: RoomState }>, store: Store) {
        this.formGroup = formBuilder.group({
            name: ['', Validators.required],
        });

        this.hosts$ = roomStore.select('room', 'roomList');
        store.dispatch(loadRooms());
    }

    ngOnInit(): void {}
}
