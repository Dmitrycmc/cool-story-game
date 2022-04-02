import { QuestionsSet } from "../types/questions-set";
import { getRandomElement } from "./array";

export const buildStory = (questionsSet: QuestionsSet, answers: string[]): string => {
    return questionsSet.template
        .replace(/\{(\d)\}/g, (_, i) => answers[i])
        .replace(/\[(\d)\]/g, (_, i) => getRandomElement(questionsSet.dictionary[i]))
        .replace(/\[(\d)\|(\d)\]/g, (_, i, j) =>
            getRandomElement(questionsSet.dictionary[i]).replace(
                /\(а\)/g,
                answers[j].endsWith('а') ? 'a' : ''
            )
        );
};
