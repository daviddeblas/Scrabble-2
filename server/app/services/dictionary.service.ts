import { Dictionary } from '@app/classes/dictionary';
import { readdirSync, readFileSync, unlink } from 'fs';
import path from 'path';
import io from 'socket.io';
import { Service } from 'typedi';
// TODO pouvoir changer de dictionnaire

export const defaultDictionary = 'Francais';
const dictionariesPath = 'assets/dictionaries';

@Service()
export class DictionaryService {
    dictionaries: Dictionary[] = [];
    sio: io.Server;

    async init() {
        this.dictionaries = [];
        const paths = await readdirSync(dictionariesPath);
        await paths.forEach(async (fileName) => {
            const dictionaryPath = path.join(dictionariesPath, fileName);
            const json = await readFileSync(dictionaryPath, { encoding: 'utf8' });
            const obj = JSON.parse(json);
            this.dictionaries.push(new Dictionary(obj.title, obj.description, obj.words, dictionaryPath));
        });
    }

    deleteDictionary(dictionaryName: string): void | Error {
        if (dictionaryName === defaultDictionary) return new Error('deleted dictionary is the default');
        const selectedDictionaryIndex = this.dictionaries.findIndex((d) => d.title === dictionaryName);
        if (selectedDictionaryIndex < 0) return new Error('dictionary not found');
        unlink(this.dictionaries[selectedDictionaryIndex].path, () => {
            return;
        });
        this.dictionaries.splice(selectedDictionaryIndex, 1);
        this.onDictionaryDeleted(dictionaryName);
    }

    onDictionaryDeleted(dictionaryName: string): void {
        this.sio.emit('dictionary deleted', dictionaryName);
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
