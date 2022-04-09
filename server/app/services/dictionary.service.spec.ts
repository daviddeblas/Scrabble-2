import { Server } from '@app/server';
import { DictionaryService } from '@app/services/dictionary.service';
import { expect } from 'chai';
import { readdirSync, readFileSync } from 'fs';
import mock from 'mock-fs';
import { restore, stub } from 'sinon';
import { Server as SocketServer } from 'socket.io';
import { io } from 'socket.io-client';
import { Container } from 'typedi';

describe('Dictionary Service', () => {
    let service: DictionaryService;

    beforeEach(async () => {
        service = Container.get(DictionaryService);
    });

    it('init should hold the dictionaries in the dictionariesPath', async () => {
        mock({
            'assets/dictionaries/test.json': `{
	                "title": "test",
	                "description": "test",
	                "words": ["test"]
                }`,
        });
        await service.init();
        expect(service.dictionaries).to.be.of.length(1);
        expect(service.dictionaries[0].title).to.eq('test');
        mock.restore();
    });

    it('setupSocketConnection emits receive dictionaries on get dictionaries', (done) => {
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        const server = new SocketServer(3000);
        server.on('connection', (socket) => {
            service.setupSocketConnection(socket);
        });
        const clientSocket = io('ws://localhost:3000');
        clientSocket.on('receive dictionaries', () => {
            server.close();
            done();
        });

        clientSocket.emit('get dictionaries');
    });

    describe('filesystem interactions', () => {
        beforeEach(async () => {
            mock({
                'assets/dictionaries/test.json': `{
	                "title": "test",
	                "description": "test",
	                "words": ["test"]
                }`,
            });
            await service.init();
        });
        it('addDictionary should add to fs and to array on valid json input', () => {
            service.addDictionary(`{
                "title": "test2",
                "description": "test2",
                "words": ["test2"]
            }`);

            expect(service.dictionaries).to.be.of.length(2);
            expect(service.dictionaries[1].title).to.eq('test2');
            expect(service.dictionaries[1].description).to.eq('test2');
            expect(service.dictionaries[1].words[0]).to.eq('test2');
            expect(readdirSync('assets/dictionaries')).to.be.of.length(2);
        });

        it('addDictionary should return error on invalid json input', () => {
            const returnValue = service.addDictionary(`{
                "title": "test2",
                "description": "test2",
                "words": ["test2"
            }`);
            expect(returnValue).to.be.instanceOf(Error);
        });

        it('addDictionary should return error on a dictionary that already exists', () => {
            const returnValue = service.addDictionary(`{
                "title": "test",
                "description": "test",
                "words": ["test"]
            }`);
            expect(returnValue).to.be.instanceOf(Error);
        });

        it('deleteDictionary should delete files and the dictionary on valid input', () => {
            stub(Container.get(Server).socketService, 'broadcastMessage');
            service.deleteDictionary('test');
            expect(service.dictionaries).to.be.of.length(0);
            expect(readdirSync('assets/dictionaries')).to.be.of.length(0);
            restore();
        });

        it("deleteDictionary shouldn't delete on defaultDictionary name", () => {
            stub(Container.get(Server).socketService, 'broadcastMessage');
            expect(service.deleteDictionary('Francais')).to.be.a('Error');
            restore();
        });

        it("deleteDictionary shouldn't delete not found dictionary", () => {
            stub(Container.get(Server).socketService, 'broadcastMessage');
            expect(service.deleteDictionary('Francaisaaaa')).to.be.a('Error');
            restore();
        });

        it('modifyInfo should modify the info in fs and in array', () => {
            service.modifyInfo('test', 'test2', 'test2');
            expect(service.dictionaries[0].title).to.eq('test2');
            expect(service.dictionaries[0].description).to.eq('test2');
            expect(JSON.parse(readFileSync('assets/dictionaries/test2.json', 'utf8')).title).to.eq('test2');
            expect(JSON.parse(readFileSync('assets/dictionaries/test2.json', 'utf8')).description).to.eq('test2');
        });

        it("modifyInfo shouldn't modify anything if the dictionary already exists", () => {
            service.addDictionary(`{
                "title": "test2",
                "description": "test2",
                "words": ["test2"]
            }`);

            const returnValue = service.modifyInfo('test2', 'test', 'test');
            expect(returnValue).to.be.an('Error');
        });

        it("modifyInfo shouldn't modify anything if the old title dictionary does not exist", () => {
            const returnValue = service.modifyInfo('test2', 'test3', 'test3');
            expect(returnValue).to.be.an('Error');
        });
        it('reset should reset', () => {
            service.addDictionary(`{
                "title": "Francais",
                "description": "Francais",
                "words": ["Francais"]
            }`);
            service.reset();
            expect(service.dictionaries).to.be.of.length(1);
            expect(service.dictionaries[0].title).to.eq('Francais');
        });

        it('getDictionaryFile should return string of the dictionary', () => {
            expect(service.getDictionaryFile('test')).to.be.a('string');
        });

        afterEach(() => {
            mock.restore();
        });
    });
});
