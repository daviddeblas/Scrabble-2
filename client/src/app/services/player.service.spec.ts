import { TestBed } from '@angular/core/testing';
import { SocketTestHelper } from '@app/helper/socket-test-helper';
import { Socket } from 'socket.io-client';
import { PlayerService } from './player.service';
import { SocketClientService } from './socket-client.service';

describe('PlayerService', () => {
    let service: PlayerService;
    let socketService: SocketTestHelper;

    beforeEach(() => {
        socketService = new SocketTestHelper();
        TestBed.configureTestingModule({});
        TestBed.inject(SocketClientService).socket = socketService as unknown as Socket;
        TestBed.compileComponents();
        service = TestBed.inject(PlayerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should send "get game status" to the socket', () => {
        const sendSpy = spyOn(socketService, 'emit');

        service.surrenderGame();

        expect(sendSpy).toHaveBeenCalledWith('surrender game');
    });
});
