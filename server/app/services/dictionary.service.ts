import dictionaryJson from '@app/../assets/dictionary.json';
import { Dictionary } from '@app/classes/dictionary';
import { Letter, lettersToString } from '@app/classes/letter';
import io from 'socket.io';
import { Service } from 'typedi';
// TODO pouvoir changer de dictionnaire

@Service()
export class DictionaryService {
    dictionary: Dictionary = Object.assign(new Dictionary(), dictionaryJson);

    setupSocketConnection(socket: io.Socket) {
        socket.on('get dictionaries', () => {
            socket.emit('receive dictionaries', ['Mon dictionnaire']);
        });
    }

    isWord(word: Letter[]): boolean {
        // TODO remplacer cette recherche lineaire qui est trop longue
        return this.dictionary.words.find((w) => w === lettersToString(word).toLowerCase()) === undefined;
    }
}
