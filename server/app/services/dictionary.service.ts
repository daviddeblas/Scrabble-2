import { Dictionary } from '@app/classes/dictionary';
import { readdir, readFile } from 'fs/promises';
import path from 'path';
import io from 'socket.io';
import { Service } from 'typedi';
// TODO pouvoir changer de dictionnaire

const dictionariesPath = 'assets/dictionaries';

@Service()
export class DictionaryService {
    dictionaries: Dictionary[] = [];

    constructor() {
        readdir(dictionariesPath).then((paths) => {
            return paths.forEach(async (fileName) => {
                return readFile(path.join(dictionariesPath, fileName), { encoding: 'utf8' }).then((json) => {
                    this.dictionaries.push(JSON.parse(json));
                });
            });
        });
    }

    getDictionary(name: string): Dictionary | undefined {
        return this.dictionaries.find((d) => d.title === name);
    }

    setupSocketConnection(socket: io.Socket) {
        socket.on('get dictionaries', () => {
            socket.emit(
                'receive dictionaries',
                this.dictionaries.map((d) => d.title),
            );
        });
    }
}
