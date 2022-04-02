export interface Question {
    text: string;
    placeholder?: string;
}

export interface QuestionsSet {
    id?: string;
    questions: Question[];
    dictionary: string[][];
    template: string;
}
