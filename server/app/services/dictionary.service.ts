import { Dictionary } from '@app/classes/dictionary';
import { readdirSync, readFileSync } from 'fs';
import path from 'path';
import io from 'socket.io';
import { Service } from 'typedi';
// TODO pouvoir changer de dictionnaire

const dictionariesPath = 'assets/dictionaries';

@Service()
export class DictionaryService {
    dictionaries: Dictionary[] = [];

    async init() {
        this.dictionaries = [];
        const paths = await readdirSync(dictionariesPath);
        await paths.forEach(async (fileName) => {
            const json = await readFileSync(path.join(dictionariesPath, fileName), { encoding: 'utf8' });
            const obj = JSON.parse(json);
            this.dictionaries.push(new Dictionary(obj.title, obj.description, obj.words));
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
