import { Dictionary } from '@app/classes/dictionary';
import { readdirSync, readFileSync, unlink, writeFile } from 'fs';
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

    addDictionary(content: string): void | Error {
        const obj = JSON.parse(content);
        const dictionaryPath = path.join(dictionariesPath, obj.title);
        const dictionary = new Dictionary(obj.title, obj.description, obj.word, dictionaryPath);
        if (this.dictionaries.findIndex((d) => d.title === dictionary.title) >= 0) return Error('dictionary with the same title already exists');
        writeFile(dictionaryPath, obj, 'utf8', () => {
            return;
        });
        this.dictionaries.push(dictionary);
    }

    modifyInfo(oldTitle: string, newTitle: string, newDescription: string): void | Error {
        if (this.getDictionary(newTitle) && oldTitle !== newTitle) return new Error('dictionary with the same title already exists');
        const dictionary = this.getDictionary(oldTitle);
        if (!dictionary) return new Error('dictionary not found');

        let err = this.deleteDictionary(dictionary.title);
        if (err) return err;

        dictionary.description = newDescription;
        dictionary.title = newTitle;

        err = this.addDictionary(JSON.stringify(dictionary));
        if (err) return err;
    }

    reset(): void {
        this.dictionaries.forEach((d) => {
            if (d.title === defaultDictionary) return;
            this.deleteDictionary(d.title);
        });
    }

    onDictionaryDeleted(dictionaryName: string): void {
        this.sio.emit('dictionary deleted', dictionaryName);
    }

    getDictionaryFile(name: string): string {
        return JSON.stringify(this.dictionaries.find((d) => d.title === name));
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
