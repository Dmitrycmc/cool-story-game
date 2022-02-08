import { BadRequest } from "../types/errors/bad-request";

import { questionsSetDto } from "../dto/questions-set";
import { QuestionsSet } from "../types/questions-set";

export const getQuestions = async (id: string): Promise<QuestionsSet> => {
    const questionsSet = await questionsSetDto.findOneById(id);

    if (questionsSet === null) {
        throw new BadRequest("Invalid questions set id: not found");
    }

    return questionsSet;
};
