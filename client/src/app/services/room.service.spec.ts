import { TestBed } from '@angular/core/testing';
import { createRoomSuccess, joinInviteReceived, loadRoomsSuccess } from '@app/actions/room.actions';
import { GameOptions } from '@app/classes/game-options';
import { RoomInfo } from '@app/classes/room-info';
import { SocketTestHelper } from '@app/helper/socket-test-helper';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { cold } from 'jasmine-marbles';
import { Socket } from 'socket.io-client';
import { RoomService } from './room.service';
import { SocketClientService } from './socket-client.service';

describe('RoomService', () => {
    let service: RoomService;
    let socketService: SocketTestHelper;
    let store: MockStore;

    beforeEach(() => {
        socketService = new SocketTestHelper();
        TestBed.configureTestingModule({
            providers: [provideMockStore()],
        });
        service = TestBed.inject(RoomService);
        TestBed.inject(SocketClientService).socket = socketService as unknown as Socket;
        store = TestBed.inject(MockStore);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should send a create room request to socket and wait for the answer', () => {
        const sendSpy = spyOn(socketService, 'emit');
        const onSpy = spyOn(socketService, 'on');

        const timer = 60;
        const gameOptions = new GameOptions('host', 'dict', timer);
        service.createRoom(gameOptions);

        expect(sendSpy).toHaveBeenCalledWith('create room', gameOptions);
        expect(onSpy).toHaveBeenCalled();
    });

    it('should dispatch "[Room] Create Room Success" for the create room success and wait for invitations', () => {
        const waitForInvitationsSpy = spyOn(service, 'waitForInvitations');
        const timer = 60;
        const gameOptions = new GameOptions('host', 'dict', timer);
        service.createRoom(gameOptions);

        const roomInfo: RoomInfo = { roomId: 'room-id', gameOptions };
        socketService.peerSideEmit('create room success', roomInfo);

        const expectedAction = cold('a', { a: createRoomSuccess({ roomInfo }) });
        expect(store.scannedActions$).toBeObservable(expectedAction);

        expect(waitForInvitationsSpy).toHaveBeenCalled();
    });

    it('should wait invitations from the server', () => {
        const onSpy = spyOn(socketService, 'on');

        service.waitForInvitations();

        expect(onSpy).toHaveBeenCalled();
    });

    it('should dispatch "[Room] Join Invite Received" when receiving invites', () => {
        const newPlayerName = 'Player 2';
        service.waitForInvitations();

        socketService.peerSideEmit('player joining', newPlayerName);

        const expectedAction = cold('a', { a: joinInviteReceived({ playerName: newPlayerName }) });
        expect(store.scannedActions$).toBeObservable(expectedAction);
    });

    it('should send refuse', () => {
        const sendSpy = spyOn(socketService, 'emit');
        service.refuseInvite();
        expect(sendSpy).toHaveBeenCalledWith('refuse');
    });

    it('should send accept', () => {
        const sendSpy = spyOn(socketService, 'emit');
        service.acceptInvite();
        expect(sendSpy).toHaveBeenCalledWith('accept');
    });

    it('should send quit', () => {
        const sendSpy = spyOn(socketService, 'emit');
        service.closeRoom();
        expect(sendSpy).toHaveBeenCalledWith('quit');
    });

    it('should request the room list and wait for an answer', () => {
        const sendSpy = spyOn(socketService, 'emit');
        const onSpy = spyOn(socketService, 'on');

        service.fetchRoomList();

        expect(sendSpy).toHaveBeenCalledWith('request list');
        expect(onSpy).toHaveBeenCalled();
    });

    describe('Room events', () => {
        const timer = 60;
        const roomList: RoomInfo[] = [new RoomInfo('room-id', new GameOptions('host', 'dict', timer))];
        const playerName = 'player 2';
        it('should dispatch "[Room] Load Rooms Success" for the create room success and wait for invitations', () => {
            service.fetchRoomList();
            socketService.peerSideEmit('get list', roomList);

            const expectedAction = cold('a', { a: loadRoomsSuccess({ rooms: roomList }) });
            expect(store.scannedActions$).toBeObservable(expectedAction);
        });

        it('should send a request to join a room and wait for an answer', () => {
            const sendSpy = spyOn(socketService, 'emit');
            const onSpy = spyOn(socketService, 'on');

            service.joinRoom(roomList[0], playerName);

            expect(sendSpy).toHaveBeenCalledWith('join room', { roomId: roomList[0].roomId, playerName });
            expect(onSpy).toHaveBeenCalledTimes(2);
        });

        // it('should dispatch "[Room] Join Room Accepted" when receiving accept', () => {
        //     service.joinRoom(roomList[0], playerName);

        //     socketService.peerSideEmit('accept');

        //     const expectedAction = cold('a', { a: joinRoomAccepted({ roomInfo: roomList[0], playerName }) });
        //     expect(store.scannedActions$).toBeObservable(expectedAction);
        // });

        // it('should dispatch "[Room] Join Room Declined" when receiving accept', () => {
        //     service.joinRoom(roomList[0], playerName);

        //     socketService.peerSideEmit('refuse');

        //     const expectedAction = cold('a', { a: joinRoomDeclined({ roomInfo: roomList[0], playerName }) });
        //     expect(store.scannedActions$).toBeObservable(expectedAction);
        // });
    });
});
