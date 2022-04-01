import http from 'http';
import io from 'socket.io';
import { Service } from 'typedi';
import { BrowserService } from './browser.service';
import { DatabaseService } from './database.service';
import { DictionaryService } from './dictionary.service';
import { GameConfigService } from './game-config.service';
import { RoomsManager } from './rooms-manager.service';

@Service()
export class SocketService {
    private sio: io.Server;

    constructor(
        server: http.Server,
        public roomManager: RoomsManager,
        public dictionaryService: DictionaryService,
        public browserService: BrowserService,
        public databaseService: DatabaseService,
        public configService: GameConfigService,
    ) {
        this.sio = new io.Server(server, { cors: { origin: '*', methods: ['GET', 'POST'] } });
        this.sio.on('connection', (socket) => {
            roomManager.setupSocketConnection(socket);
            dictionaryService.setupSocketConnection(socket);
            browserService.setupSocketConnection(socket);
            databaseService.setupSocketConnection(socket);

            socket.onAny((ns, content) => {
                console.log(ns);
                console.log(content);
            });
        });
    }

    isOpen(): boolean {
        return this.sio.getMaxListeners() > 0;
    }
}
