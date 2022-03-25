import { Game } from '@app/classes/game/game';
import { PlacedLetter } from '@app/classes/placed-letter';
import { VOWELS } from '@app/constantes';
import { Service } from 'typedi';

@Service()
export class ObjectivesVerifier {
    readonly objectiveNotCompletedScore = 0;
    verifyFirstObjective(createdWords: PlacedLetter[][]): number {
        const objectiveValue = 2;
        const minPalindromeLength = 4;
        for (const word of createdWords) {
            if (word.length < minPalindromeLength) continue;
            const reverseWord = word.reverse();
            if (this.isEqualWord(word, reverseWord)) return objectiveValue;
        }
        const multiplierWithNoPalindrome = 1;
        return multiplierWithNoPalindrome;
    }

    verifySecondObjective(placedLetters: PlacedLetter[]): number {
        const objectiveValue = 60;
        const minPlacedLetterForObjective = 3;
        if (placedLetters.length < minPlacedLetterForObjective) return this.objectiveNotCompletedScore;
        let isOnlyConsonant = true;
        placedLetters.forEach((letter) => {
            isOnlyConsonant &&= !VOWELS.includes(letter.letter.toLowerCase());
        });
        return isOnlyConsonant ? objectiveValue : this.objectiveNotCompletedScore;
    }

    verifyThirdObjective(placedLetters: PlacedLetter[]): number {
        const objectiveValue = 30;
        if (placedLetters.length < 2) return this.objectiveNotCompletedScore;
        let elongatedWordXAxis = false;
        let elongatedWordYAxis = false;
        for (let index = 0; index < placedLetters.length - 1; index++) {
            elongatedWordXAxis ||= placedLetters[index + 1].position.x - placedLetters[index].position.x > 2;
            elongatedWordYAxis ||= placedLetters[index + 1].position.y - placedLetters[index].position.y > 2;
        }
        return elongatedWordXAxis || elongatedWordYAxis ? objectiveValue : this.objectiveNotCompletedScore;
    }

    verifyFourthObjective(game: Game, score: number): number {
        const objectiveValue = 45;
        const maxSecondsForObjective = 10;
        const minScoreForObjective = 20;
        const timeSpent = 10; // TODO: Modifier le timeSpent
        if (timeSpent > maxSecondsForObjective) return this.objectiveNotCompletedScore;
        return score < minScoreForObjective ? objectiveValue : this.objectiveNotCompletedScore;
    }

    verifySixthObjective(createdWords: PlacedLetter[][]): number {
        const objectiveValue = 50;
        let isLongEnough = false;
        const smallestWordLengthForObjective = 10;
        createdWords.forEach((word) => (isLongEnough ||= word.length >= smallestWordLengthForObjective));
        return isLongEnough ? objectiveValue : this.objectiveNotCompletedScore;
    }

    verifySeventhObjective(score: number): number {
        const objectiveValue = 69;
        return score === objectiveValue ? objectiveValue : this.objectiveNotCompletedScore;
    }

    private isEqualWord(firstWord: PlacedLetter[], secondWord: PlacedLetter[]): boolean {
        if (firstWord.length !== secondWord.length) return false;
        for (const index in firstWord) {
            if (firstWord[index].letter !== secondWord[index].letter) return false;
        }
        return true;
    }
}
